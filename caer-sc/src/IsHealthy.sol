// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IFactory} from "./interfaces/IFactory.sol";
import {IChainLink} from "./interfaces/IChainLink.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IPosition} from "./interfaces/IPosition.sol";

contract IsHealthy {
    error InsufficientCollateral();

    function _isHealthy(
        address collateralToken,
        address borrowToken,
        address factory,
        uint256 ltv,
        uint256 totalBorrowAssets,
        uint256 totalBorrowShares,
        uint256 userBorrowShares,
        address addressPositions
    ) public view {
        address collateralTokenDataStream = IFactory(factory).tokenDataStream(collateralToken);
        address borrowTokenDataStream = IFactory(factory).tokenDataStream(borrowToken);

        (, int256 collateralPrice,,,) = IChainLink(collateralTokenDataStream).latestRoundData();
        (, int256 borrowPrice,,,) = IChainLink(borrowTokenDataStream).latestRoundData();

        uint8 collateralDecimals = IERC20Metadata(collateralToken).decimals(); // usually 18
        uint8 borrowDecimals = IERC20Metadata(borrowToken).decimals(); // usually 6

        uint256 borrowed = 0;
        uint256 collateralValue = 0;
        uint256 counter = IPosition(addressPositions).counter();
        for (uint256 i = 0; i < counter; i++) {
            address token = IPosition(addressPositions).tokenLists(i);
            if (token != address(0)) {
                if (token != collateralToken) {
                    uint256 tokenBalance = IERC20(token).balanceOf(addressPositions);
                    uint256 tokenDecimals = IERC20Metadata(token).decimals();

                    address tokenDataStream = IFactory(factory).tokenDataStream(token);

                    (, int256 tokenPrice,,,) = IChainLink(tokenDataStream).latestRoundData();

                    uint256 tokenAdjustedPrice = uint256(tokenPrice) * 1e18 / 1e8;
                    // balance token dikali harga token (yang sudah di convert ke 18 decimals) lalu dibagi dengan decimals token
                    uint256 tokenValue = (tokenBalance * tokenAdjustedPrice) / (10 ** tokenDecimals);

                    collateralValue += tokenValue;
                }
            }
        }
        uint256 collateralBalance = IERC20(collateralToken).balanceOf(addressPositions);
        // Adjust price to 18 decimals
        uint256 collateralAdjustedPrice = uint256(collateralPrice) * 1e18 / 1e8; // Chainlink price (8 decimals) -> 18
        // Convert collateralBalance to value in 18 decimals
        collateralValue += (collateralBalance * collateralAdjustedPrice) / (10 ** collateralDecimals);

        borrowed = (userBorrowShares * totalBorrowAssets) / totalBorrowShares;

        uint256 borrowAdjustedPrice = uint256(borrowPrice) * 1e18 / 1e8; // Chainlink price (8 decimals) -> 18
        uint256 borrowValue = (borrowed * borrowAdjustedPrice) / (10 ** borrowDecimals);
        uint256 maxBorrow = (collateralValue * ltv) / 1e18;
        if (borrowValue > maxBorrow) revert InsufficientCollateral();
    }
}

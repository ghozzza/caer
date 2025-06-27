// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IFactory} from "./interfaces/IFactory.sol";
import {IChainLink} from "./interfaces/IChainLink.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract IsHealthy {
    error InsufficientCollateral();

    function _isHealthy(address collateralToken, address borrowToken, address factory, uint256 ltv, uint256 totalBorrowAssets, uint256 totalBorrowShares, uint256 userBorrowShares, address addressPositions) public view {
        address tokenDataStream = IFactory(factory).tokenDataStream(collateralToken);
        (, int256 collateralPrice,,,) = IChainLink(tokenDataStream).latestRoundData();

        uint8 collateralDecimals = IERC20Metadata(collateralToken).decimals(); // usually 18
        uint8 borrowDecimals = IERC20Metadata(borrowToken).decimals(); // usually 6
        uint256 borrowed = 0;
        if (borrowDecimals < collateralDecimals) {
            borrowed = (((userBorrowShares * totalBorrowAssets) / totalBorrowShares) * 10 ** collateralDecimals)
                / 10 ** borrowDecimals; // 100e6
        } else {
            borrowed = (((userBorrowShares * totalBorrowAssets) / totalBorrowShares) * 10 ** borrowDecimals)
                / 10 ** collateralDecimals; // 100e6
        }
        uint256 collateralBalance = IERC20(collateralToken).balanceOf(addressPositions);
        // Adjust price to 18 decimals (from 8), if needed
        uint256 adjustedPrice = uint256(collateralPrice) * 10 ** collateralDecimals / 1e8; // Chainlink price (8 decimals) -> 18
        // Convert collateralBalance to value in 18 decimals
        //1e18 * 2.5e18 / 1e18
        uint256 collateralValue = (collateralBalance * adjustedPrice) / (10 ** collateralDecimals);
        uint256 maxBorrow = (collateralValue * ltv) / 1e18;
        if (borrowed > maxBorrow) revert InsufficientCollateral();
    }
}

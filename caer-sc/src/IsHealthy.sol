// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IFactory} from "./interfaces/IFactory.sol";
import {IChainLink} from "./interfaces/IChainLink.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IPosition} from "./interfaces/IPosition.sol";

contract IsHealthy {
    error InsufficientCollateral();

    function _isHealthy(
        address borrowToken,
        address factory,
        address addressPositions,
        uint256 ltv,
        uint256 totalBorrowAssets,
        uint256 totalBorrowShares,
        uint256 userBorrowShares
    ) public view {
        address borrowTokenDataStream = IFactory(factory).tokenDataStream(borrowToken);
        (, int256 borrowPrice,,,) = IChainLink(borrowTokenDataStream).latestRoundData();
        uint8 borrowPriceDecimals = IChainLink(borrowTokenDataStream).decimals();
        uint8 borrowDecimals = IERC20Metadata(borrowToken).decimals();

        uint256 collateralValue = 0;
        uint256 counter = IPosition(addressPositions).counter();
        for (uint256 i = 1; i <= counter; i++) {
            address token = IPosition(addressPositions).tokenLists(i);
            if (token != address(0)) {
                collateralValue += IPosition(addressPositions).tokenValue(token);
            }
        }

        uint256 borrowed = 0;
        borrowed = (userBorrowShares * totalBorrowAssets) / totalBorrowShares;

        uint256 borrowAdjustedPrice = uint256(borrowPrice) * 1e18 / 10 ** borrowPriceDecimals;
        uint256 borrowValue = (borrowed * borrowAdjustedPrice) / (10 ** borrowDecimals);
        uint256 maxBorrow = (collateralValue * ltv) / 1e18;
        if (borrowValue > collateralValue) revert InsufficientCollateral();
        if (borrowValue > maxBorrow) revert InsufficientCollateral();
    }
}

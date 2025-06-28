// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IIsHealthy {
    function _isHealthy(
        address collateralToken,
        address borrowToken,
        address factory,
        uint256 ltv,
        uint256 totalBorrowAssets,
        uint256 totalBorrowShares,
        uint256 amount,
        uint256 userBorrowShares,
        address addressPositions
    ) external;
}

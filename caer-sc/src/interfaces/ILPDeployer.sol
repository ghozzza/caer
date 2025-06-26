// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ILPDeployer {
    function deployLendingPool(address collateralToken, address borrowToken, uint256 LTV) external returns (address);
}
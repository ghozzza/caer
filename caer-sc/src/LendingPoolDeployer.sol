// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {LendingPool} from "./LendingPool.sol";

contract LendingPoolDeployer {

    function deployLendingPool(address collateralToken, address borrowToken, uint256 LTV) public returns (address) {
        LendingPool lendingPool = new LendingPool(collateralToken, borrowToken, address(this), LTV);
        return address(lendingPool);
    }
}
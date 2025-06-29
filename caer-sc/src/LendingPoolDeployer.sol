// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {LendingPool} from "./LendingPool.sol";

/**
 * @title LendingPoolDeployer
 * @author Caer Protocol
 * @notice A factory contract for deploying new LendingPool instances
 * @dev This contract is responsible for creating new lending pools with specified parameters
 * 
 * The LendingPoolDeployer allows the factory to create new lending pools with different
 * collateral and borrow token pairs, along with configurable loan-to-value (LTV) ratios.
 * Each deployed pool is a separate contract instance that manages lending and borrowing
 * operations for a specific token pair.
 */
contract LendingPoolDeployer {

    /**
     * @notice Deploys a new LendingPool contract with specified parameters
     * @param collateralToken The address of the collateral token (e.g., WETH, WBTC)
     * @param borrowToken The address of the borrow token (e.g., USDC, USDT)
     * @param factory The address of the factory contract that manages this pool
     * @param LTV The loan-to-value ratio as a percentage (e.g., 8000 for 80%)
     * @return The address of the newly deployed LendingPool contract
     * 
     * @dev This function creates a new LendingPool instance with the provided parameters.
     * The LTV parameter should be provided as a basis point value (e.g., 8000 = 80%).
     * Only the factory contract should call this function to ensure proper pool management.
     * 
     * Requirements:
     * - collateralToken must be a valid ERC20 token address
     * - borrowToken must be a valid ERC20 token address
     * - factory must be a valid contract address
     * - LTV must be greater than 0 and less than or equal to 10000 (100%)
     * 
     * @custom:security This function should only be called by the factory contract
     */
    function deployLendingPool(address collateralToken, address borrowToken, address factory, uint256 LTV) public returns (address) {
        LendingPool lendingPool = new LendingPool(collateralToken, borrowToken, factory, LTV);
        return address(lendingPool);
    }
}
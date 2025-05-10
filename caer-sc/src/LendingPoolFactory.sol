// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {LendingPool} from "./LendingPool.sol";

contract LendingPoolFactory {
    error lendingPoolHasCreated();

    event CreateLendingPool(
        address creator, address lendingPool, address token1, address token2, address oracle, uint256 LTV
    );

    struct Pools {
        address collateralToken;
        address borrowToken;
        address lendingPoolAddress;
    }

    address public oracle;
    address public solver;
    Pools[] public pools;
    uint256 public poolCount;

    constructor(address _oracle) {
        oracle = _oracle;
        solver = msg.sender;
    }

    function createLendingPool(address collateralToken, address borrowToken, uint256 LTV)
        public
        returns (address)
    {
        LendingPool lendingPool = new LendingPool(collateralToken, borrowToken, address(this), LTV);

        pools.push(Pools(collateralToken, borrowToken, address(lendingPool)));
        poolCount++;
        emit CreateLendingPool(
            msg.sender, address(lendingPool), collateralToken, borrowToken, address(this), LTV
        );
        return address(lendingPool);
    }

    function editOracle(address _oracle) public {
        oracle = _oracle;
    }

    function editSolver(address _solver) public {
        solver = _solver;
    }
}

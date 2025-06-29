// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Helper} from "./Helper.sol";
import {ILendingPool} from "../src/interfaces/ILendingPool.sol";

contract LPBorrowScript is Script, Helper {
    // --------- FILL THIS ----------
    address public lpAddress = 0x555470763e6B257C95B32A4D79BE64f4268569b7;
    address public yourWallet = 0x597c129eE29d761f4Add79aF124593Be5E0EB77e;
    uint256 public amount = 1;
    // ----------------------------

    address public linkToken = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    address public basicTokenSender = 0x174Ec8bAD0CDc86B0b09d2fF821F4DbD6e3a0a58;
    
    function setUp() public {
        // vm.createSelectFork(vm.rpcUrl("rise_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("op_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("arb_sepolia"));
        vm.createSelectFork(vm.rpcUrl("avalanche_fuji"));
        // vm.createSelectFork(vm.rpcUrl("cachain_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("educhain"));
        // vm.createSelectFork(vm.rpcUrl("pharos_devnet"));
        // vm.createSelectFork(vm.rpcUrl("op_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address borrowToken = ILendingPool(lpAddress).borrowToken();
        uint256 lpBorrowBalance = IERC20(borrowToken).balanceOf(lpAddress);
        uint256 decimal = IERC20Metadata(borrowToken).decimals();
        uint256 amountBorrow = amount * (10 ** decimal);

        vm.startBroadcast(privateKey);
        if(lpBorrowBalance < amountBorrow) {
            console.log("not enough borrow balance");
            console.log("lpBorrowBalance", lpBorrowBalance);
            console.log("Your debt amount application", amountBorrow);
            return;
        } else {
            console.log("Your balance before borrow", lpBorrowBalance);
            console.log("borrow token address", borrowToken);
            ILendingPool(lpAddress).borrowDebt(amountBorrow, Avalanche_Fuji, ILendingPool.SupportedNetworks.BASE_SEPOLIA);
            console.log("success");
            console.log("Your balance after borrow", IERC20(borrowToken).balanceOf(lpAddress));
        }
        vm.stopBroadcast();
    }
    // RUN
    // forge script LPBorrowScript -vvv --broadcast
}

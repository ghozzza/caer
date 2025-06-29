// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Helper} from "./Helper.sol";
import {IFactory} from "../src/interfaces/IFactory.sol";

contract CreateLPScript is Script, Helper {
    // --------- FILL THIS ----------
    address collateralToken = AVAX_WBTC;
    address borrowToken = AVAX_WAVAX;
    uint256 ltv = 7.5e17;
    // ----------------------------

    address factory = 0x694B5A70f83062308aa60ecf12074Bc8f694612d;

    function setUp() public {
        vm.createSelectFork(vm.rpcUrl("avalanche_fuji"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);
        IFactory(factory).createLendingPool(collateralToken, borrowToken, ltv);
        vm.stopBroadcast();
    }

    // RUN
    // forge script CreateLPScript -vvv --broadcast
}

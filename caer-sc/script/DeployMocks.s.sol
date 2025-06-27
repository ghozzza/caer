// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {MockWETH} from "../src/mocks/MockWETH.sol";
import {MockWBTC} from "../src/mocks/MockWBTC.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {MockUSDT} from "../src/mocks/MockUSDT.sol";
import {MockPEPE} from "../src/mocks/MockPEPE.sol";
import {MockBNVDA} from "../src/mocks/MockBNVDA.sol";
import {MockSAAPL} from "../src/mocks/MockSAAPL.sol";
import {MockPAXG} from "../src/mocks/MockPAXG.sol";

contract DeployMocksScript is Script {
    MockWETH public mockWETH;
    MockWBTC public mockWBTC;
    MockUSDC public mockUSDC;
    MockUSDT public mockUSDT;
    MockPEPE public mockPEPE;
    MockBNVDA public mockBNVDA;
    MockSAAPL public mockSAAPL;
    MockPAXG public mockPAXG;

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
        vm.startBroadcast(privateKey);

        // mockWETH = new MockWETH();
        // mockWBTC = new MockWBTC();
        mockUSDC = new MockUSDC();
        // mockUSDT = new MockUSDT();
        // mockPEPE = new MockPEPE();
        // mockBNVDA = new MockBNVDA();
        // mockSAAPL = new MockSAAPL();
        // mockPAXG = new MockPAXG();

        vm.stopBroadcast();

        // console.log("export const mockWeth = ", address(mockWETH));
        // console.log("export const mockWbtc = ", address(mockWBTC));
        console.log("export const mockUsdc = ", address(mockUSDC));
        // console.log("export const mockUsdt = ", address(mockUSDT));
        // console.log("export const mockPepe = ", address(mockPEPE));
        // console.log("export const mockBnvda = ", address(mockBNVDA));
        // console.log("export const mockSaapl = ", address(mockSAAPL));
        // console.log("export const mockPaxg = ", address(mockPAXG));
    }
}

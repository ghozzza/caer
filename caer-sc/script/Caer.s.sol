// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {MockWETH} from "../src/MockWETH.sol";
import {MockWBTC} from "../src/MockWBTC.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockPEPE} from "../src/MockPEPE.sol";
import {MockUSDT} from "../src/MockUSDT.sol";
import {MockBNVDA} from "../src/MockBNVDA.sol";
import {MockSAAPL} from "../src/MockSAAPL.sol";
import {MockPAXG} from "../src/MockPAXG.sol";

import {PriceFeed} from "../src/PriceFeed.sol";

import {LendingPoolFactory} from "../src/LendingPoolFactory.sol";
import {LendingPool} from "../src/LendingPool.sol";
import {Position} from "../src/Position.sol";
import {LendingPoolSequencer} from "../src/LendingPoolSequencer.sol";

contract CaerScript is Script {
    MockWETH public mockWETH;
    MockWBTC public mockWBTC;
    MockUSDC public mockUSDC;
    MockUSDT public mockUSDT;
    MockPEPE public mockPEPE;
    MockBNVDA public mockBNVDA;
    MockSAAPL public mockSAAPL;
    MockPAXG public mockPAXG;

    PriceFeed public priceFeed;

    LendingPoolFactory public lendingPoolFactory;
    LendingPool public lendingPool;
    LendingPoolSequencer public lendingPoolSequencer;
    Position public position;

    function setUp() public {
        // vm.createSelectFork(vm.rpcUrl("rise_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("op_sepolia"));
        vm.createSelectFork(vm.rpcUrl("arb_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("cachain_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("educhain"));
        // vm.createSelectFork(vm.rpcUrl("pharos_devnet"));
        // vm.createSelectFork(vm.rpcUrl("op_sepolia"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        mockWETH = new MockWETH();
        mockWBTC = new MockWBTC();
        mockUSDC = new MockUSDC();
        mockUSDT = new MockUSDT();
        mockPEPE = new MockPEPE();
        mockBNVDA = new MockBNVDA();
        mockSAAPL = new MockSAAPL();
        mockPAXG = new MockPAXG();

        priceFeed = new PriceFeed();
        lendingPoolFactory = new LendingPoolFactory(address(priceFeed));
        lendingPool = new LendingPool(address(mockWETH), address(mockUSDC), address(priceFeed), 7e17);
        lendingPoolSequencer = new LendingPoolSequencer(address(mockWETH), address(mockUSDC));
        position = new Position(address(mockWETH), address(mockUSDC), address(lendingPool), address(lendingPoolFactory));
        vm.stopBroadcast();

        console.log("export const mockWeth = ", address(mockWETH));
        console.log("export const mockWbtc = ", address(mockWBTC));
        console.log("export const mockUsdc = ", address(mockUSDC));
        console.log("export const mockUsdt = ", address(mockUSDT));
        console.log("export const mockPepe = ", address(mockPEPE));
        console.log("export const mockBnvda = ", address(mockBNVDA));
        console.log("export const mockSaapl = ", address(mockSAAPL));
        console.log("export const mockPaxg = ", address(mockPAXG));
        console.log("export const priceFeed = ", address(priceFeed));
        console.log("export const factory = ", address(lendingPoolFactory));
        console.log("export const lendingPool = ", address(lendingPool));
        console.log("export const lendingPoolSequencer = ", address(lendingPoolSequencer));
        console.log("export const position = ", address(position));
    }
}

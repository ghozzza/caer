// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";

import {MockWETH} from "../src/mocks/MockWETH.sol";
import {MockWBTC} from "../src/mocks/MockWBTC.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {MockUSDT} from "../src/mocks/MockUSDT.sol";
import {MockWAVAX} from "../src/mocks/MockWAVAX.sol";

import {LendingPoolFactory} from "../src/LendingPoolFactory.sol";
import {LendingPool} from "../src/LendingPool.sol";
import {Position} from "../src/Position.sol";
import {IsHealthy} from "../src/IsHealthy.sol";
import {LendingPoolDeployer} from "../src/LendingPoolDeployer.sol";

contract CaerScript is Script {
    MockWETH public mockWETH;
    MockWBTC public mockWBTC;
    MockUSDC public mockUSDC;
    MockUSDT public mockUSDT;
    MockWAVAX public mockWAVAX;

    IsHealthy public isHealthy;
    LendingPoolDeployer public lendingPoolDeployer;
    LendingPoolFactory public lendingPoolFactory;
    LendingPool public lendingPool;
    Position public position;

    address public ARB_BtcUsd = 0x56a43EB56Da12C0dc1D972ACb089c06a5dEF8e69;
    address public ARB_EthUsd = 0xd30e2101a97dcbAeBCBC04F14C3f624E67A35165;
    address public ARB_AvaxUsd = 0xe27498c9Cc8541033F265E63c8C29A97CfF9aC6D;
    address public ARB_UsdcUsd = 0x0153002d20B96532C639313c2d54c3dA09109309;
    address public ARB_UsdtUsd = 0x80EDee6f667eCc9f63a0a6f55578F870651f06A4;

    address public AVAX_BtcUsd = 0x31CF013A08c6Ac228C94551d535d5BAfE19c602a;
    address public AVAX_EthUsd = 0x86d67c3D38D2bCeE722E601025C25a575021c6EA;
    address public AVAX_AvaxUsd = 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD;
    address public AVAX_UsdcUsd = 0x97FE42a7E96640D932bbc0e1580c73E705A8EB73;
    address public AVAX_UsdtUsd = 0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad;

    address public basicTokenSenderETHSEPOLIA = 0xe1964f7Fa5225a0596360bB5885d63186df752EB;
    address public basicTokenSenderAVAXFUJI = 0x174Ec8bAD0CDc86B0b09d2fF821F4DbD6e3a0a58;
    address public basicTokenSenderARBSEPOLIA = 0xf38E89B07eBFAe0fC59647D198Dd077267E8CA7E;
    address public basicTokenSenderBASESEPOLIA = 0x8751aF34d18d195DF87f7dF710662eD53d49222E;

    function setUp() public {
        // vm.createSelectFork(vm.rpcUrl("rise_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("op_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("arb_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("cachain_sepolia"));
        // vm.createSelectFork(vm.rpcUrl("educhain"));
        // vm.createSelectFork(vm.rpcUrl("pharos_devnet"));
        // vm.createSelectFork(vm.rpcUrl("op_sepolia"));
        vm.createSelectFork(vm.rpcUrl("avalanche_fuji"));
    }

    function run() public {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(privateKey);

        mockWETH = new MockWETH();
        mockWBTC = new MockWBTC();
        mockWAVAX = new MockWAVAX();
        mockUSDC = new MockUSDC();
        mockUSDT = new MockUSDT();

        if (block.chainid == 43113) {
            isHealthy = new IsHealthy();
            lendingPoolDeployer = new LendingPoolDeployer();
            lendingPoolFactory = new LendingPoolFactory(address(isHealthy), address(lendingPoolDeployer));
            lendingPool = new LendingPool(address(mockWETH), address(mockUSDC), address(lendingPoolFactory), 7e17);
            position =
                new Position(address(mockWETH), address(mockUSDC), address(lendingPool), address(lendingPoolFactory));

            lendingPoolFactory.addTokenDataStream(address(mockWETH), AVAX_EthUsd);
            lendingPoolFactory.addTokenDataStream(address(mockWBTC), AVAX_BtcUsd);
            lendingPoolFactory.addTokenDataStream(address(mockWAVAX), AVAX_AvaxUsd);
            lendingPoolFactory.addTokenDataStream(address(mockUSDC), AVAX_UsdcUsd);
            lendingPoolFactory.addTokenDataStream(address(mockUSDT), AVAX_UsdtUsd);

            lendingPoolFactory.addBasicTokenSender(11155111, basicTokenSenderETHSEPOLIA);
            lendingPoolFactory.addBasicTokenSender(43113, basicTokenSenderAVAXFUJI);
            lendingPoolFactory.addBasicTokenSender(421614, basicTokenSenderARBSEPOLIA);
            lendingPoolFactory.addBasicTokenSender(84532, basicTokenSenderBASESEPOLIA);
        }
        vm.stopBroadcast();

        console.log("export const mockWeth = ", address(mockWETH));
        console.log("export const mockWbtc = ", address(mockWBTC));
        console.log("export const mockWavax = ", address(mockWAVAX));
        console.log("export const mockUsdc = ", address(mockUSDC));
        console.log("export const mockUsdt = ", address(mockUSDT));
        if (block.chainid == 43113) {
            console.log("export const factory = ", address(lendingPoolFactory));
            console.log("export const lendingPool = ", address(lendingPool));
            console.log("export const position = ", address(position));
        }
    }

    // RUN
    // forge script CaerScript -vvv --broadcast
}

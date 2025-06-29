// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ILendingPool} from "../src/interfaces/ILendingPool.sol";
import {Helper} from "./Helper.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IFactory} from "../src/interfaces/IFactory.sol";

contract Shortcut_SwapCollateral is Script, Helper {
    // --------- FILL THIS ----------
    address public lpAddress = 0x94bb056b417043D7A7087CCF09DBdB77B19a5C90;
    address public yourWallet = 0x597c129eE29d761f4Add79aF124593Be5E0EB77e;
    address public factory = 0xbAeb98c34ff0C165dBb0C81489f485a4416563e2;
    uint256 public amount = 1;
    address public tokenIn = AVAX_WETH;
    address public tokenOut = AVAX_USDC;
    // ----------------------------

    address public AVAX_BtcUsd = 0x31CF013A08c6Ac228C94551d535d5BAfE19c602a;
    address public AVAX_EthUsd = 0x86d67c3D38D2bCeE722E601025C25a575021c6EA;
    address public AVAX_AvaxUsd = 0x5498BB86BC934c8D34FDA08E81D444153d0D06aD;
    address public AVAX_UsdcUsd = 0x97FE42a7E96640D932bbc0e1580c73E705A8EB73;
    address public AVAX_UsdtUsd = 0x7898AcCC83587C3C55116c5230C17a6Cd9C71bad;

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
        address userPosition = ILendingPool(lpAddress).addressPositions(yourWallet);

        vm.startBroadcast(privateKey);
        uint256 tokenInBefore = IERC20(tokenIn).balanceOf(userPosition);
        uint256 tokenOutBefore = IERC20(tokenOut).balanceOf(userPosition);
        console.log("tokenInBefore", tokenInBefore);
        console.log("tokenOutBefore", tokenOutBefore);
        // ILendingPool(lpAddress).swapTokenByPosition(tokenIn, tokenOut, amount * 1e17);
        uint256 tokenInAfter = IERC20(tokenIn).balanceOf(userPosition);
        uint256 tokenOutAfter = IERC20(tokenOut).balanceOf(userPosition);
        console.log("tokenInAfter", tokenInAfter);
        console.log("tokenOutAfter", tokenOutAfter);

        console.log("weth token data stream", IFactory(factory).tokenDataStream(AVAX_WETH));
        console.log("wbtc token data stream", IFactory(factory).tokenDataStream(AVAX_WBTC));
        console.log("usdc token data stream", IFactory(factory).tokenDataStream(AVAX_USDC));
        console.log("usdt token data stream", IFactory(factory).tokenDataStream(AVAX_USDT));
        console.log("avax token data stream", IFactory(factory).tokenDataStream(AVAX_WAVAX));

        console.log("--------------------------------");

        IFactory(factory).addTokenDataStream(AVAX_WETH, AVAX_EthUsd);
        IFactory(factory).addTokenDataStream(AVAX_WBTC, AVAX_BtcUsd);
        IFactory(factory).addTokenDataStream(AVAX_USDC, AVAX_UsdcUsd);
        IFactory(factory).addTokenDataStream(AVAX_USDT, AVAX_UsdtUsd);
        IFactory(factory).addTokenDataStream(AVAX_WAVAX, AVAX_AvaxUsd);

        console.log("weth token data stream", IFactory(factory).tokenDataStream(AVAX_WETH));
        console.log("wbtc token data stream", IFactory(factory).tokenDataStream(AVAX_WBTC));
        console.log("usdc token data stream", IFactory(factory).tokenDataStream(AVAX_USDC));
        console.log("usdt token data stream", IFactory(factory).tokenDataStream(AVAX_USDT));
        console.log("avax token data stream", IFactory(factory).tokenDataStream(AVAX_WAVAX));

        vm.stopBroadcast();
    }
    // RUN
    // forge script Shortcut_SwapCollateral -vvv --broadcast
}

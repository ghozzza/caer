// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {IPosition} from "../src/interfaces/IPosition.sol";
import {LendingPoolFactory} from "../src/LendingPoolFactory.sol";
import {LendingPool} from "../src/LendingPool.sol";
import {Position} from "../src/Position.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {MockUSDT} from "../src/mocks/MockUSDT.sol";
import {MockWBTC} from "../src/mocks/MockWBTC.sol";
import {MockWETH} from "../src/mocks/MockWETH.sol";
import {MockWAVAX} from "../src/mocks/MockWAVAX.sol";
import {MockPEPE} from "../src/mocks/MockPEPE.sol";
import {Helper} from "../src/Helper.sol";

contract LendingPoolFactoryTest is Test {
    LendingPoolFactory public lendingPoolFactory;
    LendingPool public lendingPool;
    Position public position;
    MockUSDC public usdc;
    MockWBTC public wbtc;
    MockWETH public weth;
    MockUSDT public usdt;
    MockWAVAX public wavax;
    MockPEPE public pepe;

    address public owner = makeAddr("owner");

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");

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

    uint256 public chainId = 43113;

    bool priceFeedIsActive = false;

    function setUp() public {
        usdc = new MockUSDC();
        usdt = new MockUSDT();
        wbtc = new MockWBTC();
        weth = new MockWETH();
        wavax = new MockWAVAX();
        pepe = new MockPEPE();

        vm.startPrank(alice);
        // vm.createSelectFork("https://sepolia-rollup.arbitrum.io/rpc", 166448675);
        vm.createSelectFork("https://api.avax-test.network/ext/bc/C/rpc");

        lendingPoolFactory = new LendingPoolFactory();
        lendingPool = new LendingPool(address(weth), address(usdc), address(lendingPoolFactory), 7e17);
        position = new Position(address(weth), address(usdc), address(lendingPool), address(lendingPoolFactory));

        lendingPoolFactory.addBasicTokenSender(11155111, basicTokenSenderETHSEPOLIA);
        lendingPoolFactory.addBasicTokenSender(43113, basicTokenSenderAVAXFUJI);
        lendingPoolFactory.addBasicTokenSender(421614, basicTokenSenderARBSEPOLIA);
        lendingPoolFactory.addBasicTokenSender(84532, basicTokenSenderBASESEPOLIA);

        lendingPoolFactory.addTokenDataStream(address(wbtc), AVAX_BtcUsd);
        lendingPoolFactory.addTokenDataStream(address(weth), AVAX_EthUsd);
        lendingPoolFactory.addTokenDataStream(address(wavax), AVAX_AvaxUsd);
        lendingPoolFactory.addTokenDataStream(address(usdc), AVAX_UsdcUsd);
        lendingPoolFactory.addTokenDataStream(address(usdt), AVAX_UsdtUsd);
        vm.stopPrank();

        vm.startPrank(bob);
        lendingPool.createPosition();
        vm.stopPrank();

        usdc.mint_mock(alice, 10_000e6);
        weth.mint_mock(alice, 100e18);

        usdc.mint_mock(bob, 2000e6);
        weth.mint_mock(bob, 200e18);
    }

    function helper_supply(address _user, address _token, uint256 _amount) public {
        vm.startPrank(_user);
        IERC20(address(_token)).approve(address(lendingPool), _amount);
        lendingPool.supplyLiquidity(_amount);
        vm.stopPrank();
    }

    function helper_supply_borrow() public {
        vm.startPrank(alice);
        IERC20(address(usdc)).approve(address(lendingPool), 1000e6);
        lendingPool.supplyLiquidity(1000e6);
        vm.stopPrank();

        vm.startPrank(bob);
        IERC20(address(weth)).approve(address(lendingPool), 150e18);
        lendingPool.supplyCollateral(150e18);
        lendingPool.borrowDebt(500e6, chainId, Helper.SupportedNetworks.AVALANCHE_FUJI);
        vm.stopPrank();
    }

    function helper_repay() public {
        helper_supply_borrow();

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 500e6);
        lendingPool.repayWithSelectedToken(454e6, address(usdc), false); // 454 shares setara 499.4
        vm.stopPrank();

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 300e6);
        lendingPool.repayWithSelectedToken(46e6, address(usdc), false); // 46 shares setara 50.6
        vm.stopPrank();
    }

    function test_borrow() public {
        // bob borrow 1800 usdc
        uint256 borrowed = 1800e6;
        uint256 lended = 1e18;

        // alice supply 10000 usdc
        helper_supply(alice, address(usdc), 10_000e6);

        uint256 tempBobBalanceUSDC = IERC20(address(usdc)).balanceOf(bob);
        uint256 tempBobBalanceWETH = IERC20(address(weth)).balanceOf(bob);

        vm.startPrank(bob);
        // bob supply 1 WETH as collateral
        IERC20(address(weth)).approve(address(lendingPool), lended);
        lendingPool.supplyCollateral(lended);

        // bob borrow usdc
        lendingPool.borrowDebt(borrowed, chainId, Helper.SupportedNetworks.AVALANCHE_FUJI);

        uint256 tempBobBalanceUSDC2 = IERC20(address(usdc)).balanceOf(bob);
        uint256 tempBobBalanceWETH2 = IERC20(address(weth)).balanceOf(bob);
        vm.stopPrank();

        assertEq(tempBobBalanceUSDC2 - tempBobBalanceUSDC, borrowed);
        assertEq(tempBobBalanceWETH - lended, tempBobBalanceWETH2);
    }

    function test_withdrawLiquidity() public {
        // alice supply 1000 usdc
        helper_supply(alice, address(usdc), 1000e6);
        uint256 aliceBalanceAfterSupply = IERC20(address(usdc)).balanceOf(alice);
        uint256 withdrawAmount = 400e6;
        vm.startPrank(alice);
        // zero Amount
        vm.expectRevert(LendingPool.ZeroAmount.selector);
        lendingPool.withdrawLiquidity(0);

        // insufficient shares
        vm.expectRevert(LendingPool.InsufficientShares.selector);
        lendingPool.withdrawLiquidity(10_000e6);

        lendingPool.withdrawLiquidity(withdrawAmount);
        vm.stopPrank();

        assertEq(IERC20(address(usdc)).balanceOf(alice), aliceBalanceAfterSupply + withdrawAmount);
    }

    function test_repay() public {
        helper_supply_borrow();

        vm.warp(block.timestamp + 365 days);

        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob)); // 2500e6
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 500e6);
        lendingPool.repayWithSelectedToken(454e6, address(usdc), false); // 454 shares equals to 499.4
        vm.stopPrank();

        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total supply assets after repay", lendingPool.totalSupplyAssets()); // no changes
        console.log("total borrow assets after repay", lendingPool.totalBorrowAssets()); // 50.6e6
        console.log("total borrow shares after repay", lendingPool.totalBorrowShares()); // 46e6
        console.log("user borrow shares after repay", lendingPool.userBorrowShares(bob)); // 46e6

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 50.6e6);
        lendingPool.repayWithSelectedToken(46e6, address(usdc), false); // 46 shares equals to 50.6
        vm.stopPrank();

        console.log("bob balance", IERC20(address(usdc)).balanceOf(bob));
        console.log("total supply assets after repay 2", lendingPool.totalSupplyAssets()); // no changes
        console.log("total borrow assets after repay 2", lendingPool.totalBorrowAssets()); // 0
        console.log("total borrow shares after repay 2", lendingPool.totalBorrowShares()); // 0
        console.log("user borrow shares after repay 2", lendingPool.userBorrowShares(bob)); // 0
    }

    function test_part2_repay() public {
        console.log("----- before borrow");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 0
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 0
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 0
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 0
        console.log("-----");

        helper_supply_borrow();

        vm.warp(block.timestamp + 365 days);

        console.log("------ after borrow 500 USDC + warp 365 days");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6
        console.log("-----");

        vm.startPrank(bob);
        console.log("------ check balance of position weth");
        console.log(
            "balance of position weth before swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob))
        );
        console.log("lending pool collaterals before swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("-----");
        lendingPool.swapTokenByPosition(address(weth), address(usdc), 0.1e18);
        console.log("------ weth swap to usdc");
        console.log(
            "balance of position weth after swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob))
        );
        console.log("lending pool collaterals after swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("position usdc IERC20 balance", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("-----");

        console.log("------ usdc swap to weth");
        console.log("bob's collaterals on lending pool", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "balance of position weth before swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob))
        );
        console.log(
            "balance of position usdc before swap", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob))
        );
        lendingPool.swapTokenByPosition(address(usdc), address(weth), 100e6);
        console.log("bob's collaterals on lending pool after swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "balance of position weth after swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob))
        );
        console.log(
            "balance of position usdc after swap", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob))
        );
        console.log("-----");

        console.log("------ after repay using weth");
        console.log("bob's collaterals on lending pool before repay", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "bob's position before repay weth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob))
        );
        lendingPool.repayWithSelectedToken(50e6, address(weth), true); // 50 shares == 55 USDC
        console.log("bob's collaterals on lending pool after repay", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "bob's position after repay weth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob))
        );

        vm.stopPrank();
    }

    function test_part3_repay() public {
        console.log("----- before borrow");
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 0
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 0
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 0
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 0
        console.log("-----");

        helper_supply_borrow();
        vm.warp(block.timestamp + 365 days);

        console.log("----- after borrow 500 USDC + warp 365 days");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6
        console.log("-----");

        vm.startPrank(bob);
        console.log("lending pool collaterals before swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "position usdc balance before swap",
            IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)) / 1e6
        );
        lendingPool.swapTokenByPosition(address(weth), address(usdc), 15e18);
        console.log("----- weth swap to usdc");
        console.log("lending pool collaterals after swap", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("position usdc balance", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)) / 1e6);
        console.log("-----");

        lendingPool.repayWithSelectedToken(45e6, address(weth), true);
        console.log("----- repay with weth");
        console.log("lending pool collaterals", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("total borrow shares", lendingPool.totalBorrowShares());
        console.log("-----");

        lendingPool.repayWithSelectedToken(45e6, address(usdc), true);
        console.log("----- repay with usdc");
        console.log("total borrow shares", lendingPool.totalBorrowShares());
        console.log("position usdc balance", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)) / 1e6);
        console.log("-----");
        vm.stopPrank();
    }

    function test_part4_repay() public {
        vm.startPrank(bob);
        // --------- supply collateral
        IERC20(address(weth)).approve(address(lendingPool), 1e18);
        lendingPool.supplyCollateral(1e18);

        // --------- supply liquidity
        IERC20(address(usdc)).approve(address(lendingPool), 1000e6);
        lendingPool.supplyLiquidity(1000e6);

        // --------- check balance
        console.log("bob balance weth", IERC20(address(weth)).balanceOf(bob));
        console.log("bob balance weth position", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("bob balance usdc position", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));

        // --------- supply collateral
        IERC20(address(weth)).approve(address(lendingPool), 1e18);
        lendingPool.supplyCollateral(1e18);

        // --------- check balance
        console.log("bob balance weth", IERC20(address(weth)).balanceOf(bob));
        console.log("bob balance weth position", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("bob balance usdc position", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        // ------------------------------------------------------------------------------------------
        // swap v2
        // approve weth
        address addressPosition = lendingPool.addressPositions(bob);
        console.log("--------------------------------");
        console.log("position balance weth before swap", IERC20(address(weth)).balanceOf(addressPosition));
        console.log("position balance usdc before swap", IERC20(address(usdc)).balanceOf(addressPosition));

        // IPosition(addressPosition).swapTokenByPositionV2(address(wethBaseMain), address(usdcBaseMain), 1e18, 1000);
        lendingPool.swapTokenByPosition(address(weth), address(usdc), 1e18);
        console.log("--------------------------------");
        console.log("position balance weth after swap", IERC20(address(weth)).balanceOf(addressPosition));
        console.log("position balance usdc after swap", IERC20(address(usdc)).balanceOf(addressPosition));
        console.log("--------------------------------");

        //check balance
        console.log("bob balance weth before withdraw collateral", IERC20(address(weth)).balanceOf(bob)); //108.00000000000000
        console.log("--------------------------------");

        //withdraw collateral
        lendingPool.withdrawCollateral(1e18);

        //check balance
        console.log("bob balance weth after withdraw collateral", IERC20(address(weth)).balanceOf(bob)); //109.000000000000000000
        console.log("positionbalance weth after withdraw collateral", IERC20(address(weth)).balanceOf(addressPosition));
        console.log("--------------------------------");

        console.log("bob balance usdc before borrow", IERC20(address(usdc)).balanceOf(bob));
        console.log("--------------------------------");
        lendingPool.borrowDebt(700e6, chainId, Helper.SupportedNetworks.AVALANCHE_FUJI);
        console.log("bob balance usdc after borrow", IERC20(address(usdc)).balanceOf(bob));
        console.log("--------------------------------");

        // repay with selected token
        console.log("position balance usdc before repay", IERC20(address(usdc)).balanceOf(addressPosition));
        console.log("--------------------------------");
        lendingPool.repayWithSelectedToken(500e6, address(usdc), true);
        console.log("position balance usdc after repay", IERC20(address(usdc)).balanceOf(addressPosition));
        console.log("--------------------------------");

        vm.stopPrank();
    }

    function test_withdraw_withshares() public {
        helper_repay();

        console.log("alice balance before", IERC20(address(usdc)).balanceOf(alice));
        vm.startPrank(alice);
        // zero Amount
        vm.expectRevert(LendingPool.ZeroAmount.selector);
        lendingPool.withdrawLiquidity(0);

        // insufficient shares
        vm.expectRevert(LendingPool.InsufficientShares.selector);
        lendingPool.withdrawLiquidity(10_000e6);

        lendingPool.withdrawLiquidity(1000e6); // 1000 shares setara 1050 usdc
        vm.stopPrank();
    }

    function test_web_flow() public {
        vm.startPrank(bob);

        IERC20(address(usdc)).approve(address(lendingPool), 1000e6);
        lendingPool.supplyLiquidity(1000e6);

        console.log("----------------------------------------------------------------");
        console.log("Bob supply Shares", lendingPool.totalSupplyShares());
        console.log("Bob supply Assets", lendingPool.totalSupplyAssets());
        console.log("----------------------------------------------------------------");

        IERC20(address(weth)).approve(address(lendingPool), 5e18);
        lendingPool.supplyCollateral(5e18);

        console.log("----------------------------------------------------------------");
        console.log("Bob supply Assets 5eth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("----------------------------------------------------------------");

        lendingPool.borrowDebt(500e6, chainId, Helper.SupportedNetworks.AVALANCHE_FUJI);
        console.log("----------------------------------------------------------------");
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("----------------------------------------------------------------");

        vm.warp(block.timestamp + 365 days);

        console.log("----------------------------------------------------------------");
        console.log("Bob supply Shares", lendingPool.totalSupplyShares());
        console.log("Bob supply Assets", lendingPool.totalSupplyAssets());
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("----------------------------------------------------------------");

        lendingPool.swapTokenByPosition(address(weth), address(usdc), 1e18);

        console.log("----------------------------------------------------------------");
        console.log("Bob weth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");
        lendingPool.repayWithSelectedToken(100e6, address(usdc), true);

        console.log("----------------------------------------------------------------");
        console.log("Bob weth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");
        vm.warp(block.timestamp + 365 days);

        lendingPool.borrowDebt(100e6, chainId, Helper.SupportedNetworks.AVALANCHE_FUJI);
        console.log("----------------------------------------------------------------");
        console.log("Bob weth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");

        vm.warp(block.timestamp + 365 days);

        lendingPool.repayWithSelectedToken(100e6, address(usdc), true);
        console.log("----------------------------------------------------------------");
        console.log("Bob weth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");

        vm.stopPrank();
    }

    function test_scenarios() public {
        helper_supply(alice, address(usdc), 10_000e6);

        vm.startPrank(bob);

        IERC20(address(weth)).approve(address(lendingPool), 10e18);
        lendingPool.supplyCollateral(10e18);
        assertEq(IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)), 10e18);
        lendingPool.borrowDebt(2000e6, chainId, Helper.SupportedNetworks.AVALANCHE_FUJI);
        assertEq(lendingPool.userBorrowShares(bob), 2000e6);

        // vm.expectRevert(LendingPool.PositionUnavailable.selector);
        lendingPool.swapTokenByPosition(address(weth), address(wbtc), 0.1e18);
        assertEq(IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)), 9.9e18);
        vm.stopPrank();
    }
}

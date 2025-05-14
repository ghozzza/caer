// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {LendingPoolFactory} from "../src/LendingPoolFactory.sol";
import {LendingPool} from "../src/LendingPool.sol";
import {Position} from "../src/Position.sol";
import {MockUSDC} from "../src/MockUSDC.sol";
import {MockPEPE} from "../src/MockPEPE.sol";
import {MockWBTC} from "../src/MockWBTC.sol";
import {MockWETH} from "../src/MockWETH.sol";
import {MockMANTA} from "../src/MockMANTA.sol";
import {PriceFeed} from "../src/PriceFeed.sol";

interface IFactory {
    function solver() external view returns (address);
    function oracle() external view returns (address);
}

interface IOracle {
    function getPrice(address _collateral, address _borrow) external view returns (uint256);
    function getPriceTrade(address _tokenFrom, address _tokenTo) external view returns (uint256, uint256);
    function getQuoteDecimal(address _token) external view returns (uint256);
    function priceCollateral(address _token) external view returns (uint256);
}

interface IPosition {
    function getTokenOwnerLength() external view returns (uint256);
    function getTokenOwnerBalances(address _token) external view returns (uint256);
    function getTokenCounter(address _token) external view returns (uint256);
    function getTokenOwnerAddress(uint256 _counter) external view returns (address);
    function getAllTokenOwnerAddress() external view returns (address[] memory);
    function counter() external view returns (uint256);
    function swapToken(address _token, uint256 _amount) external;
    function costSwapToken(address _token, uint256 _amount) external;
    function listingTradingPosition(address _token, uint256 _price, string memory _name) external;
    function buyTradingPosition(uint256 _price, address _buyer) external;
    function swapTokenByPositionV2(address _tokenIn, address _tokenOut, uint256 _amountIn, uint256 _minAmountOut) external;
}

contract LendingPoolFactoryTest is Test {
    LendingPoolFactory public lendingPoolFactory;
    LendingPool public lendingPool;
    Position public position;
    IOracle public oracle;
    MockUSDC public usdc;
    MockWBTC public wbtc;
    MockWETH public weth;
    MockMANTA public manta;
    MockPEPE public pepe;

    PriceFeed public priceFeed;

    address public owner = makeAddr("owner");

    address public alice = makeAddr("alice");
    address public bob = makeAddr("bob");
    address public ghoza = 0xa5ea1Cb1033F5d3BD207bF6a2a2504cF1c3e9F42;

    address public usdcBaseSepolia = address(0x036CbD53842c5426634e7929541eC2318f3dCF7e);
    address public usdtBaseSepolia = address(0x00D1C02E008D594ebEFe3F3b7fd175850f96AEa0);
    address public wethBaseSepolia = address(0x4200000000000000000000000000000000000006);

    address public usdcBaseMain = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    address public wethBaseMain = 0x4200000000000000000000000000000000000006;

    bool priceFeedIsActive = false;

    function setUp() public {
        usdc = new MockUSDC();
        wbtc = new MockWBTC();
        weth = new MockWETH();
        manta = new MockMANTA();
        pepe = new MockPEPE();

        priceFeed = new PriceFeed();
        oracle = IOracle(address(priceFeed));

        vm.startPrank(alice);
        // vm.createSelectFork("https://eth-mainnet.g.alchemy.com/v2/npJ88wr-vv5oxDKlp0mQYSfVXfN2nKif", 21843948);
        // vm.createSelectFork("https://sepolia.base.org", 25684416);

        vm.createSelectFork("https://virtual.base.rpc.tenderly.co/78cea8f4-da62-4444-b5f6-01ebb02fb27c");

        lendingPoolFactory = new LendingPoolFactory(address(oracle));
        // lendingPool = new LendingPool(address(weth), address(usdc), address(lendingPoolFactory), 7e17);
        // position = new Position(address(weth), address(usdc), address(lendingPool), address(lendingPoolFactory));
        lendingPool = new LendingPool(address(wethBaseMain), address(usdcBaseMain), address(lendingPoolFactory), 7e17);
        position = new Position(
            address(wethBaseMain), address(usdcBaseMain), address(lendingPool), address(lendingPoolFactory)
        );
        vm.stopPrank();

        vm.startPrank(bob);
        lendingPool.createPosition();
        vm.stopPrank();

        usdc.mint(alice, 10_000e6);
        weth.mint(alice, 100e18);

        usdc.mint(bob, 2000e6);
        weth.mint(bob, 200e18);

        priceFeed.addPriceManual("WBTC/USD", address(wbtc), 97086.06 * 10 ** 8, 8); // 97086.06
        priceFeed.addPriceManual("USDC/USD", address(usdc), 99999021, 6); //0.99999021
        priceFeed.addPriceManual("WETH/USD", address(weth), 2633.49 * 10 ** 8, 18); // 2633.49000000
        priceFeed.addPriceManual("PEPE/USD", address(pepe), 0.00001023 * 10 ** 8, 18); //0.00001015
        priceFeed.addPriceManual("MANTA/USD", address(manta), 0.405 * 10 ** 8, 18); //0.99999021
    }

    function helper_supply(address _user, address _token, uint256 _amount) public {
        vm.startPrank(_user);
        IERC20(_token).approve(address(lendingPool), _amount);
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
        lendingPool.borrowDebt(500e6, false);
        vm.stopPrank();
    }

    function helper_repay() public {
        helper_supply_borrow();

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 500e6);
        lendingPool.repayDebt(454e6); // 454 shares setara 499.4
        vm.stopPrank();

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 300e6);
        lendingPool.repayDebt(46e6); // 46 shares setara 50.6
        vm.stopPrank();
    }

    function test_oracle() public view {
        console.log(IFactory(address(lendingPoolFactory)).oracle());
        console.log(address(oracle));
        assertEq(IFactory(address(lendingPoolFactory)).oracle(), address(oracle));
    }

    function test_borrow() public {
        // bob borrow 1800 usdc
        uint256 borrowed = 1800e6;
        uint256 lended = 1e18;

        // alice supply 1000 usdc
        helper_supply(alice, address(usdc), 10_000e6);

        uint256 tempBobBalanceUSDC = IERC20(address(usdc)).balanceOf(bob);
        uint256 tempBobBalanceWETH = IERC20(address(weth)).balanceOf(bob);

        vm.startPrank(bob);
        // bob supply 1 WETH as collateral
        IERC20(weth).approve(address(lendingPool), lended);
        lendingPool.supplyCollateral(lended);

        // bob borrow usdc
        lendingPool.borrowDebt(borrowed, false);

        uint256 tempBobBalanceUSDC2 = IERC20(address(usdc)).balanceOf(bob);
        uint256 tempBobBalanceWETH2 = IERC20(address(weth)).balanceOf(bob);
        vm.stopPrank();

        assertEq(tempBobBalanceUSDC2 - tempBobBalanceUSDC, borrowed);
        assertEq(tempBobBalanceWETH - lended, tempBobBalanceWETH2);
    }

    function test_withdraw() public {
        helper_supply(alice, address(usdc), 1000e6);
        uint256 aliceBalanceAfterSupply = IERC20(address(usdc)).balanceOf(alice);
        uint256 withdrawAmount = 400e6;
        vm.startPrank(alice);
        // zero Amount
        vm.expectRevert(LendingPool.ZeroAmount.selector);
        lendingPool.withdraw(0);

        // insufficient shares
        vm.expectRevert(LendingPool.InsufficientShares.selector);
        lendingPool.withdraw(10_000e6);

        lendingPool.withdraw(withdrawAmount);
        vm.stopPrank();

        assertEq(IERC20(address(usdc)).balanceOf(alice), aliceBalanceAfterSupply + withdrawAmount);
    }

    function test_repay() public {
        helper_supply_borrow();

        vm.warp(block.timestamp + 365 days);
        lendingPool.accrueInterest();

        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 500e6);
        lendingPool.repayDebt(454e6); // 454 shares equals to 499.4
        vm.stopPrank();

        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total supply assets after repay", lendingPool.totalSupplyAssets()); // no changes
        console.log("total borrow assets after repay", lendingPool.totalBorrowAssets()); // 50.6e6
        console.log("total borrow shares after repay", lendingPool.totalBorrowShares()); // 46e6
        console.log("user borrow shares after repay", lendingPool.userBorrowShares(bob)); // 46e6

        vm.startPrank(bob);
        IERC20(address(usdc)).approve(address(lendingPool), 50.6e6);
        lendingPool.repayDebt(46e6); // 46 shares equals to 50.6
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
        lendingPool.accrueInterest();

        console.log("----- after borrow 500 USDC + warp 365 days");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6
        console.log("-----");

        vm.startPrank(bob);
        deal(address(usdcBaseSepolia), address(bob), 4000e6);
        console.log("-----");
        console.log("balance of position weth", IERC20(address(weth)).balanceOf(lendingPool.addressPositions(bob)));
        console.log("-----");
        // lendingPool.swapTokenByPosition(address(usdc), address(weth), 0.1e18);
        // console.log("----- weth swap to usdc");
        // console.log("lending pool collaterals", lendingPool.userCollaterals(bob), 0);
        // console.log("balance of lending pool weth", IERC20(address(weth)).balanceOf(address(lendingPool)));
        // console.log(
        //     "position usdc IERC20 balance", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob))
        // );

        console.log("bob balance usdcBaseSepolia", IERC20(address(usdcBaseSepolia)).balanceOf(bob));
        IERC20(address(usdcBaseSepolia)).approve(address(lendingPool), 2500e6);
        // lendingPool.swaptesting(address(usdcBaseSepolia), address(wethBaseSepolia), 2500e6, 0);

        console.log("bob balance wethBaseSepolia", IERC20(address(wethBaseSepolia)).balanceOf(bob));
        console.log("-----");

        // console.log("----- usdc swap to weth");
        // console.log("bob's collaterals on lending pool", lendingPool.userCollaterals(bob));
        // console.log("balance of lending pool weth", IERC20(address(weth)).balanceOf(address(lendingPool)));
        // lendingPool.swapTokenByPosition(address(weth), address(usdc), 100e6);
        // console.log(
        //     "position usdc IERC20 balance", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob))
        // );
        // console.log("-----");

        // console.log("----- after repay using weth");
        // lendingPool.repayWithSelectedToken(100e6, address(weth)); // 500 shares == 55 USDC
        // console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        // console.log("balance of lending pool weth", IERC20(address(weth)).balanceOf(address(lendingPool)));
        // console.log(
        //     "balance of lending pool usdc", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob))
        // );
        // console.log("-----");
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
        lendingPool.accrueInterest();

        console.log("----- after borrow 500 USDC + warp 365 days");
        console.log("balance bob usdc", IERC20(address(usdc)).balanceOf(bob));
        console.log("total borrow shares before", lendingPool.totalBorrowShares()); // 500e6
        console.log("total borrow assets before", lendingPool.totalBorrowAssets()); // 550e6
        console.log("total supply assets before", lendingPool.totalSupplyAssets()); // 1050e6
        console.log("user borrow shares before", lendingPool.userBorrowShares(bob)); // 500e6
        console.log("-----");

        vm.startPrank(bob);
        lendingPool.swapTokenByPosition(address(usdc), address(weth), 15e18);
        console.log("----- weth swap to usdc");
        console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        // console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc), 0)); // 39502.736731
        console.log("-----");

        lendingPool.repayWithSelectedToken(45e6, address(weth));
        console.log("----- repay with weth");
        console.log("lending pool collaterals", lendingPool.userCollaterals(bob));
        // console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc), 0)); // 39552.236731 harusnya berkurang
        console.log("total borrow shares", lendingPool.totalBorrowShares());
        console.log("-----");

        lendingPool.repayWithSelectedToken(45e6, address(usdc));
        console.log("----- repay with usdc");
        // console.log("position usdc balance", lendingPool.getTokenBalancesByPosition(address(usdc), 0)); // 39552.236731 harusnya berkurang
        console.log("total borrow shares", lendingPool.totalBorrowShares());
        console.log("-----");
        // console.log("calculator", lendingPool.tokenCalculator(1e18, address(weth), address(usdc)));
        vm.stopPrank();
    }

    function test_part4_repay() public {
        vm.startPrank(ghoza);
        // check balance usdc ghoza
        console.log("----------------------");
        console.log("---------------------- beforeswap token");
        console.log("----------------------");

        console.log("ghoza balance weth", IERC20(address(wethBaseMain)).balanceOf(ghoza));
        console.log("ghoza balance usdc", IERC20(address(usdcBaseMain)).balanceOf(ghoza));
        console.log("----------------------");
        console.log("---------------------- swap token");
        console.log("----------------------");
        IERC20(address(wethBaseMain)).approve(address(lendingPool), 1e18);
        // lendingPool.swaptesting(address(wethBaseMain), address(usdcBaseMain), 1e18, 0);

        console.log("----------------------");
        console.log("---------------------- afterswap token");
        console.log("----------------------");
        console.log("ghoza balance weth", IERC20(address(wethBaseMain)).balanceOf(ghoza));
        console.log("ghoza balance usdc", IERC20(address(usdcBaseMain)).balanceOf(ghoza));

        vm.stopPrank();
    }

    function test_part5_repay() public {
        vm.startPrank(ghoza);
        // lendingPool.createPosition();
        
        // --------- supply collateral
        IERC20(address(wethBaseMain)).approve(address(lendingPool), 1e18);
        lendingPool.supplyCollateral(1e18);

        // --------- check balance
        console.log("ghoza balance weth", IERC20(address(wethBaseMain)).balanceOf(ghoza));
        console.log(
            "ghoza balance weth position", IERC20(address(wethBaseMain)).balanceOf(lendingPool.addressPositions(ghoza))
        );

        // --------- supply collateral
        IERC20(address(wethBaseMain)).approve(address(lendingPool), 1e18);
        lendingPool.supplyCollateral(1e18);

        // --------- check balance
        console.log("ghoza balance weth", IERC20(address(wethBaseMain)).balanceOf(ghoza));
        console.log(
            "ghoza balance weth position", IERC20(address(wethBaseMain)).balanceOf(lendingPool.addressPositions(ghoza))
        );

        // ------------------------------------------------------------------------------------------

        // swap v2
        // approve weth
        address addressPosition = lendingPool.addressPositions(ghoza);
        IERC20(address(wethBaseMain)).approve(addressPosition, 1e18);
        // lendingPool.swapTokenByPositionV2(address(wethBaseMain), address(usdcBaseMain), 1e18, 1000);
        IPosition(addressPosition).swapTokenByPositionV2(address(wethBaseMain), address(usdcBaseMain), 1e18, 1000);

        // check balance address position
        console.log("ghoza balance weth position", IERC20(address(wethBaseMain)).balanceOf(lendingPool.addressPositions(ghoza)));
        console.log("ghoza balance usdc position", IERC20(address(usdcBaseMain)).balanceOf(lendingPool.addressPositions(ghoza)));
        vm.stopPrank();



    }

    function test_withdraw_withshares() public {
        helper_repay();

        console.log("alice balance before", IERC20(address(usdc)).balanceOf(alice));
        vm.startPrank(alice);
        // zero Amount
        vm.expectRevert(LendingPool.ZeroAmount.selector);
        lendingPool.withdraw(0);

        // insufficient shares
        vm.expectRevert(LendingPool.InsufficientShares.selector);
        lendingPool.withdraw(10_000e6);

        lendingPool.withdraw(1000e6); // 1000 shares setara 1050 usdc
        vm.stopPrank();
    }

    function test_swap() public {
        console.log("test price feed PEPE", priceFeed.priceCollateral(address(pepe)));
        console.log("test price feed WETH", priceFeed.priceCollateral(address(weth)));

        vm.startPrank(bob);
        IERC20(address(weth)).approve(address(lendingPool), 1.2e18); // awalnya deal 2 ether, jadi 0,8 ether
        lendingPool.supplyCollateral(1.2e18);
        vm.stopPrank();

        // berkurang udah bisa supply collateral
        console.log("bob balance weth", IERC20(address(weth)).balanceOf(bob)); // 800000000000000000 = 0,8 ether

        /**
         * @param swapTokenByPosition(toToken, fromToken, amountIn)
         * 1. WETH is collateral token, can be trade
         * 2. USDC is not collateral token, can't be trade
         * 3. USDC can be trade, if collateral token swap to USDC
         */
        vm.startPrank(bob);
        uint256 amountOut2 = lendingPool.swapTokenByPosition(address(usdc), address(weth), 0.1e18);
        console.log("amountOut2", amountOut2); // 51485630508031539802751413
        // console.log("-------dapet berapa usdc=====", lendingPool.getTokenBalancesByPosition(address(usdc), 0));

        // vm.expectRevert(LendingPool.TokenNotAvailable.selector);
        // uint256 amountOut3 = lendingPool.swapTokenByPosition(address(usdc), address(usdc), 526703156);
        // console.log("amountOut3", amountOut3); // 52670315.600000000000000000
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
        console.log("Bob supply Assets 5eth", lendingPool.userCollaterals(bob));
        console.log("----------------------------------------------------------------");

        lendingPool.borrowDebt(500e6, false);
        console.log("----------------------------------------------------------------");
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("----------------------------------------------------------------");

        vm.warp(block.timestamp + 365 days);
        lendingPool.accrueInterest();

        console.log("----------------------------------------------------------------");
        console.log("Bob supply Shares", lendingPool.totalSupplyShares());
        console.log("Bob supply Assets", lendingPool.totalSupplyAssets());
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("----------------------------------------------------------------");

        lendingPool.swapTokenByPosition(address(usdc), address(weth), 1e18);

        console.log("----------------------------------------------------------------");
        console.log("Bob weth", lendingPool.userCollaterals(bob));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");
        lendingPool.repayWithSelectedToken(100e6, address(usdc));

        console.log("----------------------------------------------------------------");
        console.log("Bob weth", lendingPool.userCollaterals(bob));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");
        vm.warp(block.timestamp + 365 days);

        lendingPool.borrowDebt(100e6, false);
        console.log("----------------------------------------------------------------");
        console.log("Bob weth", lendingPool.userCollaterals(bob));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");

        vm.warp(block.timestamp + 365 days);

        lendingPool.repayWithSelectedToken(100e6, address(usdc));
        console.log("----------------------------------------------------------------");
        console.log("Bob weth", lendingPool.userCollaterals(bob));
        console.log("Bob borrow shares", lendingPool.userBorrowShares(bob));
        console.log("Bob borrow assets", lendingPool.totalBorrowAssets());
        console.log("Bob usdc ierc 20", IERC20(address(usdc)).balanceOf(lendingPool.addressPositions(bob)));
        console.log(
            "Bob usdc position", IPosition(lendingPool.addressPositions(bob)).getTokenOwnerBalances(address(usdc))
        );
        console.log("----------------------------------------------------------------");

        vm.stopPrank();
    }

    function helper_tokenCalculator(uint256 _amount, address _tokenFrom, address _tokenTo)
        public
        view
        returns (uint256)
    {
        (uint256 _realPrice,) = IOracle(oracle).getPriceTrade(_tokenTo, _tokenFrom);
        uint256 amountOut = _amount * IOracle(oracle).getQuoteDecimal(_tokenTo) / _realPrice;
        return amountOut;
    }

    function helper_swap() public view {
        console.log("Bob's Collateral", lendingPool.userCollaterals(bob)); // 1 ether

        (uint256 pepePrice,) = IOracle(oracle).getPriceTrade(address(pepe), address(usdc));
        (uint256 wbtcPrice,) = IOracle(oracle).getPriceTrade(address(wbtc), address(usdc));

        console.log("-----");
        // console.log("weth/usdc", IOracle(oracle).getPrice(weth, usdc));
        console.log("weth/usd", IOracle(oracle).priceCollateral(address(weth))); // 2633.49000000
        console.log("0.2 weth/usd", 2 * IOracle(oracle).priceCollateral(address(weth)) / 10); // 526.69800000
        console.log(
            "weth/usdc",
            IOracle(oracle).priceCollateral(address(weth)) * 1e6 / IOracle(oracle).priceCollateral(address(usdc))
        ); // 2633.515782
        console.log(
            "0.2 weth/usdc",
            2 * (IOracle(oracle).priceCollateral(address(weth)) * 1e6 / IOracle(oracle).priceCollateral(address(usdc)))
                / 10
        ); // 526703156
        console.log("pepe/usd", IOracle(oracle).priceCollateral(address(pepe))); // 0.00001010
        console.log("usdc/usd", IOracle(oracle).priceCollateral(address(usdc))); // 0.99999021
        console.log(
            "pepe/usdc",
            IOracle(oracle).priceCollateral(address(pepe)) * 1e6 / IOracle(oracle).priceCollateral(address(usdc))
        ); // 0.000010
        console.log("pepe decimal", IOracle(oracle).getQuoteDecimal(address(pepe))); // 1000000000000000000
        console.log(
            "1 eth dapat pepe sejumlah:", 2633515782 * IOracle(oracle).getQuoteDecimal(address(pepe)) / pepePrice
        ); // 263351578.200000000000000000
        console.log(
            "1 eth dapat wbtc sejumlah:", 2633515782 * IOracle(oracle).getQuoteDecimal(address(wbtc)) / wbtcPrice
        ); // 257380254
        console.log("1 eth dapat wbtc sejumlah:", 2633515782 * 1e8 / wbtcPrice); // 0.02712531
        console.log("-----");
        // uint256 totalPepe = priceFeed.priceCollateral(address(pepe)) * amountOut3 / 1e18;
        // console.log("Price of PEPE/USD", totalPepe); // 262.32009831
        // uint256 totalWETH = priceFeed.priceCollateral(address(weth)) * lendingPool.userCollaterals(bob) / 1e18;
        // console.log("Price of WETH/USD", totalWETH); // 3133.57000000
        console.log("-----");
        console.log("-----");
        console.log("-----");
    }

    function test_scenarios() public {
        helper_supply(alice, address(usdc), 10_000e6);

        vm.startPrank(bob);

        IERC20(weth).approve(address(lendingPool), 10e18);
        lendingPool.supplyCollateral(10e18);
        assertEq(lendingPool.userCollaterals(bob), 10e18);
        lendingPool.borrowDebt(2000e6, false);
        assertEq(lendingPool.userBorrowShares(bob), 2000e6);

        // vm.expectRevert(LendingPool.PositionUnavailable.selector);
        lendingPool.swapTokenByPosition(address(wbtc), address(weth), 1e18);
        assertEq(lendingPool.userCollaterals(bob), 9e18);
        vm.stopPrank();
    }

    function test_swapTokenByPositionV2() public {
        // Setup: Create position and supply some tokens
        vm.startPrank(ghoza);
        
        // Create position
        lendingPool.createPosition();
        address positionAddress = lendingPool.addressPositions(ghoza);
        
        // Supply some collateral
        uint256 collateralAmount = 1 ether;
        IERC20(address(wethBaseMain)).approve(address(lendingPool), collateralAmount);
        lendingPool.supplyCollateral(collateralAmount);
        
        // Setup tokens for swap
        address tokenIn = address(wethBaseMain);  // WETH
        address tokenOut = address(usdcBaseMain);     // USDC
        uint256 swapAmount = 0.5 ether;              // Amount to swap
        
        // Mint some USDC to the position for testing
        IERC20(address(usdcBaseMain)).approve(positionAddress, 1000e6);   // 1000 USDC
        
        // Approve position to spend tokens
        IERC20(address(wethBaseMain)).approve(positionAddress, swapAmount);
        
        // Execute swap
        uint256 minAmountOut = 0; // For testing, we can set this to 0
        // lendingPool.swapTokenByPositionV2(tokenIn, tokenOut, swapAmount, minAmountOut);
        
        // Verify balances after swap
        // uint256 positionBalanceAfter = IERC20(address(usdcBaseMain)).balanceOf(positionAddress);
        uint256 lendingPoolBalanceAfter = IERC20(address(wethBaseMain)).balanceOf(address(lendingPool));
        
        // Assert that tokens were transferred from position to lending pool
        assertEq(lendingPoolBalanceAfter, swapAmount, "Lending pool should receive the swap amount");
        
        vm.stopPrank();
    }
}

// karena user trading account nya bisa dijual atau gimana?

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {ITokenSwap} from "./interface/ITokenSwap.sol";
import {IChainLink} from "./interface/IChainLink.sol";
import {IOracle} from "./interface/IOracle.sol";
import {IFactory} from "./interface/IFactory.sol";
import {ISwapRouter} from "./interface/ISwapRouter.sol"; // keknya gakepake

contract Position is ReentrancyGuard {
    using SafeERC20 for IERC20; // fungsi dari IERC20 akan ketambahan SafeERC20

    error TokenNotFound();
    error InsufficientBalance();
    error TradingAccountListed();
    error InvalidPrice();
    error NotForSale();
    error ZeroAmount();
    error SameToken();
    error NotForWithdraw();
    error QuotePriceZero();
    error BasePriceZero();

    struct ListingDetail {
        bool isListing;
        uint256 price;
        string name;
        address sellWithToken;
    }

    address public collateralAssets;
    address public borrowAssets;
    address public owner;
    address public lpAddress;
    address public factory;
    address public router = address(0x2626664c2603336E57B271c5C0b26F421741e481);

    uint256 public counter;

    mapping(uint256 => address) public tokenLists;
    mapping(address => uint256) public tokenListsId;
    mapping(address => uint256) public tokenBalances;

    ListingDetail public listingDetail;

    event Liquidate(address user);
    event SwapToken(address user, address token, uint256 amount);
    event CostSwapToken(address user, address token, uint256 amount);
    event ListingTradingPosition(address user, address token, uint256 price, string name);
    event BuyTradingPosition(address user, address token, uint256 price, string name);

    constructor(address _collateral, address _borrow, address _lpAddress, address _factory) {
        collateralAssets = _collateral;
        borrowAssets = _borrow;
        lpAddress = _lpAddress;
        factory = _factory;
        owner = msg.sender;
    }

    function liquidate() public {
        emit Liquidate(owner);
    }

    function swapToken(address _token, uint256 _amount) public {
        if (tokenListsId[_token] == 0) {
            ++counter;
            tokenLists[counter] = _token;
            tokenListsId[_token] = counter;
        }
        tokenBalances[_token] += _amount;
        emit SwapToken(msg.sender, _token, _amount);
    }

    function costSwapToken(address _token, uint256 _amount) public {
        if (tokenListsId[_token] == 0) revert TokenNotFound();
        tokenBalances[_token] -= _amount;
        emit CostSwapToken(msg.sender, _token, _amount);
    }

    function listingTradingPosition(address _token, uint256 _price, string memory _name) public {
        if (listingDetail.isListing) revert TradingAccountListed();
        listingDetail = ListingDetail(true, _price, _name, _token);
        emit ListingTradingPosition(msg.sender, _token, _price, _name);
    }

    function buyTradingPosition(uint256 _price, address _buyer) public nonReentrant {
        if (_price != listingDetail.price) revert InvalidPrice();
        if (!listingDetail.isListing) revert NotForSale();
        IERC20(listingDetail.sellWithToken).safeTransferFrom(_buyer, owner, _price);
        owner = _buyer;
        listingDetail = ListingDetail(false, 0, "", address(0));
        emit BuyTradingPosition(_buyer, listingDetail.sellWithToken, _price, listingDetail.name);
    }

    function getTokenOwnerLength() public view returns (uint256) {
        return counter;
    }

    function getTokenOwnerAddress(uint256 _counter) public view returns (address) {
        return tokenLists[_counter];
    }

    function getTokenOwnerBalances(address _token) public view returns (uint256) {
        return tokenBalances[_token];
    }

    function getTokenCounter(address _token) public view returns (uint256) {
        return tokenListsId[_token];
    }

    function getAllTokenOwnerAddress() public view returns (address[] memory) {
        address[] memory records = new address[](counter);
        for (uint256 i = 0; i < counter; i++) {
            records[i] = tokenLists[i + 1];
        }
        return records;
    }

    function withdrawCollateral(uint256 amount, address _user) public {
        if (msg.sender != lpAddress) revert NotForWithdraw();
        IERC20(collateralAssets).safeTransfer(_user, amount);
    }

    function swapTokenByPosition(
        address _tokenIn,
        address _tokenOut,
        uint256 amountIn,
        address _tokenInPrice,
        address _tokenOutPrice
    ) public returns (uint256 amountOut) {
        uint256 balances = IERC20(_tokenIn).balanceOf(address(this));
        if (msg.sender != lpAddress) revert NotForWithdraw();
        if (amountIn == 0) revert ZeroAmount();
        if (balances < amountIn) revert InsufficientBalance();

        amountOut = tokenCalculator(_tokenIn, _tokenOut, amountIn, _tokenInPrice, _tokenOutPrice);
        if (_tokenIn != collateralAssets) costSwapToken(_tokenIn, amountIn);
        ITokenSwap(_tokenIn).burn(address(this), amountIn);
        ITokenSwap(_tokenOut).mint(address(this), amountOut);
        swapToken(_tokenOut, amountOut);
    }
    // 100 usdc, weth, harga weth, harga usdc
    function repayWithSelectedToken(uint256 amount, address _token, address _tokenInPrice, address _tokenOutPrice) public {
        if (msg.sender != lpAddress) revert NotForWithdraw();
        uint256 balance = IERC20(_token).balanceOf(address(this));
        if (_token != borrowAssets) {
            uint256 amountOut = swapTokenByPosition(_token, borrowAssets, balance, _tokenInPrice, _tokenOutPrice);
            IERC20(_token).approve(lpAddress, amount);
            IERC20(borrowAssets).safeTransfer(lpAddress, amount);
            if (amountOut - amount != 0) swapTokenByPosition(borrowAssets, _token, (amountOut - amount), _tokenOutPrice, _tokenInPrice);
        } else {
            IERC20(borrowAssets).safeTransfer(lpAddress, amount);
        }
    }

    function tokenCalculator(
        address _tokenIn,
        address _tokenOut,
        uint256 _amountIn,
        address _tokenInPrice,
        address _tokenOutPrice
    ) public view returns (uint256) {
        uint256 tokenInDecimal = IERC20Metadata(_tokenIn).decimals();
        uint256 tokenOutDecimal = IERC20Metadata(_tokenOut).decimals();
        (, int256 quotePrice,,,) = IChainLink(_tokenInPrice).latestRoundData();
        (, int256 basePrice,,,) = IChainLink(_tokenOutPrice).latestRoundData();

        uint256 amountOut =
            (_amountIn * ((uint256(quotePrice) * (10 ** tokenOutDecimal)) / uint256(basePrice))) / 10 ** tokenInDecimal;

        return amountOut;
    }
}

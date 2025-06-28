// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20Metadata} from "openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {ITokenSwap} from "./interfaces/ITokenSwap.sol";
import {IChainLink} from "./interfaces/IChainLink.sol";
import {IFactory} from "./interfaces/IFactory.sol";

contract Position is ReentrancyGuard {
    using SafeERC20 for IERC20; // fungsi dari IERC20 akan ketambahan SafeERC20

    error InsufficientBalance();
    error ZeroAmount();
    error NotForWithdraw();

    address public collateralAssets;
    address public borrowAssets;
    address public owner;
    address public lpAddress;
    address public factory;

    uint256 public counter;

    mapping(uint256 => address) public tokenLists;
    mapping(address => uint256) public tokenListsId;

    event Liquidate(address user);
    event SwapToken(address user, address token, uint256 amount);
    event SwapTokenByPosition(address user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event WithdrawCollateral(address indexed user, uint256 amount);

    constructor(address _collateral, address _borrow, address _lpAddress, address _factory) {
        collateralAssets = _collateral;
        borrowAssets = _borrow;
        lpAddress = _lpAddress;
        factory = _factory;
        owner = msg.sender;
    }

    function swapToken(address _token, uint256 _amount) public {
        if (tokenListsId[_token] == 0) {
            ++counter;
            tokenLists[counter] = _token;
            tokenListsId[_token] = counter;
        }
        emit SwapToken(msg.sender, _token, _amount);
    }

    function withdrawCollateral(uint256 amount, address _user) public {
        if (msg.sender != lpAddress) revert NotForWithdraw();
        IERC20(collateralAssets).safeTransfer(_user, amount);
        emit WithdrawCollateral(_user, amount);
    }

    function swapTokenByPosition(address _tokenIn, address _tokenOut, uint256 amountIn)
        public
        returns (uint256 amountOut)
    {
        uint256 balances = IERC20(_tokenIn).balanceOf(address(this));
        if (msg.sender != lpAddress) revert NotForWithdraw();
        if (amountIn == 0) revert ZeroAmount();
        if (balances < amountIn) revert InsufficientBalance();

        address _tokenInPrice = IFactory(factory).tokenDataStream(_tokenIn);
        address _tokenOutPrice = IFactory(factory).tokenDataStream(_tokenOut);

        amountOut = tokenCalculator(_tokenIn, _tokenOut, amountIn, _tokenInPrice, _tokenOutPrice);
        ITokenSwap(_tokenIn).burn_mock(amountIn);
        ITokenSwap(_tokenOut).mint_mock(address(this), amountOut);
        swapToken(_tokenOut, amountOut);
        emit SwapTokenByPosition(msg.sender, _tokenIn, _tokenOut, amountIn, amountOut);
    }

    function repayWithSelectedToken(uint256 amount, address _token) public {
        if (msg.sender != lpAddress) revert NotForWithdraw();
        uint256 balance = IERC20(_token).balanceOf(address(this));
        if (_token != borrowAssets) {
            uint256 amountOut = swapTokenByPosition(_token, borrowAssets, balance);
            IERC20(_token).approve(lpAddress, amount);
            IERC20(borrowAssets).safeTransfer(lpAddress, amount);
            if (amountOut - amount != 0) swapTokenByPosition(borrowAssets, _token, (amountOut - amount));
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

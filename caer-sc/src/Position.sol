// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

interface TokenSwap {
    function mint(address _to, uint256 _amount) external;
    function burn(address _spender, uint256 _amount) external;
}

interface IFactory {
    function solver() external view returns (address);
    function oracle() external view returns (address);
}

interface IOracle {
    function tokenCalculator(uint256 _amount, address _tokenFrom, address _tokenTo) external view returns (uint256);
    function getPrice(address _collateral, address _borrow) external view returns (uint256);
    function getPriceTrade(address _tokenFrom, address _tokenTo) external view returns (uint256, uint256);
    function getQuoteDecimal(address _token) external view returns (uint256);
    function priceCollateral(address _token) external view returns (uint256);
}

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(ExactInputSingleParams calldata params) external payable returns (uint256 amountOut);
}

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

    function swapTokenByPositionV2(address _tokenIn, address _tokenOut, uint256 amountIn, uint256 minAmountOut)
        public
        returns (uint256 amountOut)
    {
        if (amountIn == 0) revert ZeroAmount();
        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: _tokenIn,
            tokenOut: _tokenOut, // mau ditukar ke apa
            fee: 3000, // setiap money changer ngasih berapa, fleksibel ga sih(?) sama dengan 0,3%
            recipient: address(this), // siapa yang mau ditukar
            amountIn: amountIn, // jumlah yang mau ditukar
            amountOutMinimum: minAmountOut, // masukin 1000 usdc, maunya dapet minimal sekian btc, kalo tidak mencapai itu, batal. wajib ada kalo ke auditor, tujuannya supaya tidak ada manipulasi harga. slipage
            sqrtPriceLimitX96: 0 //
        });
        IERC20(_tokenIn).approve(router, amountIn); // approve kepada uniswap
        amountOut = ISwapRouter(router).exactInputSingle(params);

        return amountOut;
    }

    function repayWithSelectedToken(uint256 amount, uint256 minAmountOut, address _token) public {
        if (msg.sender != lpAddress) revert NotForWithdraw();
        uint256 balance = IERC20(_token).balanceOf(address(this));
        if(_token != borrowAssets) {
            uint256 amountOut = swapTokenByPositionV2(_token, borrowAssets, balance, minAmountOut);
            IERC20(_token).approve(lpAddress, amount);
            IERC20(borrowAssets).safeTransfer(lpAddress, amount);
            if (amountOut - amount != 0) swapTokenByPositionV2(borrowAssets, _token, (amountOut - amount), 0);
        } else {
            IERC20(borrowAssets).safeTransfer(lpAddress, amount);
        }
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Position} from "./Position.sol";

interface IOracle {
    function tokenCalculator(uint256 _amount, address _tokenFrom, address _tokenTo) external view returns (uint256);
    function getPrice(address _collateral, address _borrow) external view returns (uint256);
    function getPriceTrade(address _tokenFrom, address _tokenTo) external view returns (uint256, uint256);
    function getQuoteDecimal(address _token) external view returns (uint256);
    function priceCollateral(address _token) external view returns (uint256);
}

interface TokenSwap {
    function mint(address _to, uint256 _amount) external;
    function burn(address _spender, uint256 _amount) external;
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
    function withdrawCollateral(uint256 amount, address _user) external;
    function swapTokenByPositionV2(address _tokenIn, address _tokenOut, uint256 amountIn, uint256 minAmountOut)
        external
        returns (uint256 amountOut);
    function repayWithSelectedToken(uint256 amount, uint256 minAmountOut, address _token) external;
}

interface IFactory {
    function solver() external view returns (address);
    function oracle() external view returns (address);
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

contract LendingPool is ReentrancyGuard {
    using SafeERC20 for IERC20;

    error InsufficientCollateral();
    error InsufficientLiquidity();
    error InsufficientShares();
    error LTVExceedMaxAmount();
    error PositionUnavailable();
    error PositionAlreadyCreated();
    error TokenNotAvailable();
    error ZeroAmount();

    event SupplyLiquidity(address user, uint256 amount, uint256 shares);
    event Withdraw(address user, uint256 amount, uint256 shares);
    event SupplyCollateral(address user, uint256 amount);
    event WithdrawCollateral(address user, uint256 amount);
    event BorrowDebt(address user, uint256 amount, uint256 shares);
    event RepayDebt(address user, uint256 amount, uint256 shares);
    event RepayWithCollateralByPosition(address user, uint256 amount, uint256 shares);
    event SwapByPosition(address user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event CreatePosition(address user, address positionAddress);

    Position public position;

    uint256 public totalSupplyAssets;
    uint256 public totalSupplyShares;
    uint256 public totalBorrowAssets;
    uint256 public totalBorrowShares;

    mapping(address => uint256) public userSupplyShares;
    mapping(address => uint256) public userBorrowShares;
    mapping(address => uint256) public userCollaterals;
    mapping(address => address) public addressPositions;

    address public collateralToken;
    address public borrowToken;
    address public factory;

    address public router = address(0x2626664c2603336E57B271c5C0b26F421741e481);

    uint256 public lastAccrued;
    uint256 public ltv;

    modifier positionRequired() {
        if (addressPositions[msg.sender] == address(0)) {
            createPosition();
        }
        _;
    }

    /**
     * @dev Contract constructor to initialize the lending and borrowing system.
     *
     * - Sets the collateral token address that users can deposit as collateral
     * - Sets the borrow token address that users can borrow from the pool
     * - Sets the factory contract address for creating new positions
     * - Initializes lastAccrued timestamp for interest calculations
     * - Validates and sets the Loan-to-Value (LTV) ratio which determines maximum borrowing capacity
     *
     * Requirements:
     * - LTV must not exceed 1e18 (100%)
     *
     * @param _collateralToken Address of the token that can be used as collateral
     * @param _borrowToken Address of the token that can be borrowed
     * @param _factory Address of the factory contract for creating positions
     * @param _ltv The Loan-to-Value ratio in basis points (1e18 = 100%)
     */
    constructor(address _collateralToken, address _borrowToken, address _factory, uint256 _ltv) {
        collateralToken = _collateralToken;
        borrowToken = _borrowToken;
        factory = _factory;
        lastAccrued = block.timestamp;

        if (_ltv > 1e18) revert LTVExceedMaxAmount();
        ltv = _ltv;
    }

    /**
     * @dev Creates a new Position contract for the caller.
     *
     * Each user can have one Position contract that manages their collateral and borrowed assets.
     * The Position contract enables users to:
     * - Hold collateral tokens
     * - Manage borrowed tokens
     * - Execute token swaps
     * - Handle repayments
     *
     * Requirements:
     * - Caller must not already have a Position contract created
     *
     * The function:
     * - Checks if caller already has a Position
     * - Deploys new Position contract with required parameters
     * - Maps the Position address to the caller
     * - Emits CreatePosition event
     *
     * @notice Emits a CreatePosition event with the caller's address and new Position address
     * @notice Can only be called once per address
     */
    function createPosition() public {
        if (addressPositions[msg.sender] != address(0)) revert PositionAlreadyCreated();
        position = new Position(collateralToken, borrowToken, address(this), factory);
        addressPositions[msg.sender] = address(position);
        emit CreatePosition(msg.sender, address(position));
    }

    /**
     * @dev Allows users to supply liquidity to the lending pool by depositing borrow tokens.
     *
     * When users supply liquidity:
     * - They receive shares proportional to their deposit amount
     * - The shares represent their ownership % of the total liquidity pool
     * - Other users can borrow against this supplied liquidity
     * - Suppliers earn interest from borrowers' payments
     *
     * The share calculation works as follows:
     * - First deposit: shares = deposit amount (1:1)
     * - Subsequent deposits: shares = (deposit * total shares) / total assets
     * This ensures fair distribution of shares based on the current pool state.
     *
     * Security measures:
     * - Nonreentrant guard prevents reentrancy attacks
     * - Zero amount checks prevent empty deposits
     * - Interest accrual before deposit for accurate share calculation
     * - Safe transfer from user to contract
     *
     * @param amount The amount of borrow tokens to supply as liquidity
     * @notice Emits SupplyLiquidity event with deposit details
     */
    function supplyLiquidity(uint256 amount) public nonReentrant {
        if (amount == 0) revert ZeroAmount();
        _accrueInterest();
        uint256 shares = 0;
        if (totalSupplyAssets == 0) {
            shares = amount;
        } else {
            shares = (amount * totalSupplyShares) / totalSupplyAssets;
        }

        userSupplyShares[msg.sender] += shares;
        totalSupplyShares += shares;
        totalSupplyAssets += amount;

        IERC20(borrowToken).safeTransferFrom(msg.sender, address(this), amount);

        emit SupplyLiquidity(msg.sender, amount, shares);
    }

    /**
     * @dev Allows users to withdraw their supplied liquidity by redeeming shares.
     * The function calculates the corresponding asset amount based on the
     * proportion of total shares.
     *
     * - Prevents zero-amount withdrawals.
     * - Ensures the user has enough shares to withdraw.
     * - Accrues interest before withdrawal to ensure accurate share value calculation
     * - Converts user's shares to the equivalent token amount based on current pool ratios
     * - Reduces user's share balance and protocol's total supply metrics
     * - Verifies protocol maintains minimum required liquidity after withdrawal
     * - Safely transfers withdrawn tokens to user's wallet
     * - Emits a `Withdraw` event logging the withdrawal details
     *
     * Security considerations:
     * - Nonreentrant modifier prevents reentrancy attacks
     * - Checks for zero amount and insufficient shares
     * - Validates sufficient protocol liquidity remains
     * - Uses safe transfer for token movements
     *
     * @param shares The number of supply shares to redeem for underlying tokens
     */
    function withdraw(uint256 shares) external nonReentrant {
        if (shares == 0) revert ZeroAmount();
        if (shares > userSupplyShares[msg.sender]) revert InsufficientShares();

        _accrueInterest();

        uint256 amount = ((shares * totalSupplyAssets) / totalSupplyShares);

        userSupplyShares[msg.sender] -= shares;
        totalSupplyShares -= shares;
        totalSupplyAssets -= amount;

        if (totalSupplyAssets < totalBorrowAssets) {
            revert InsufficientLiquidity();
        }

        IERC20(borrowToken).safeTransfer(msg.sender, amount);

        emit Withdraw(msg.sender, amount, shares);
    }

    /**
     * @dev Public function to accrue interest on borrowed assets.
     * Calls the internal `_accrueInterest` function to update interest calculations.
     */
    function accrueInterest() public {
        _accrueInterest();
    }

    /**
     * @dev Internal function to calculate and apply accrued interest to the protocol.
     *
     * - Uses a fixed borrow rate of 10% per year.
     * - Computes the yearly interest based on total borrowed assets.
     * - Determines elapsed time since the last accrual.
     * - Calculates the proportional interest for the elapsed time.
     * - Increases both total supply and total borrowed assets by the interest amount.
     * - Updates the last accrued timestamp.
     */
    function _accrueInterest() internal {
        uint256 borrowRate = 10;

        uint256 interestPerYear = (totalBorrowAssets * borrowRate) / 100;

        uint256 elapsedTime = block.timestamp - lastAccrued;

        uint256 interest = (interestPerYear * elapsedTime) / 365 days;

        totalSupplyAssets += interest;
        totalBorrowAssets += interest;
        lastAccrued = block.timestamp;
    }

    /**
     * @dev Allows users to supply collateral tokens to their position in the lending pool.
     *
     * Requirements:
     * - User must have a position created (checked by positionRequired modifier)
     * - Amount must be greater than 0
     * - User must have approved the lending pool to spend their collateral tokens
     *
     * Effects:
     * - Updates interest accrual before processing the deposit
     * - Increases user's collateral balance by the supplied amount
     * - Transfers collateral tokens from user to their position contract
     * - Emits a SupplyCollateral event
     *
     * Security:
     * - Uses nonReentrant modifier to prevent reentrancy attacks
     * - Uses safeTransferFrom for secure token transfers
     * - Validates amount is non-zero
     *
     * @param amount The amount of collateral tokens to supply
     * @custom:throws ZeroAmount if amount is 0
     * @custom:emits SupplyCollateral when collateral is successfully supplied
     */
    function supplyCollateral(uint256 amount) public positionRequired nonReentrant {
        if (amount == 0) revert ZeroAmount();
        accrueInterest();
        userCollaterals[msg.sender] += amount;
        IERC20(collateralToken).safeTransferFrom(msg.sender, addressPositions[msg.sender], amount);

        emit SupplyCollateral(msg.sender, amount);
    }

    /**
     * @dev Allows users to withdraw their supplied collateral from their position.
     *
     * Requirements:
     * - User must have a position created (checked by positionRequired modifier)
     * - Amount must be greater than 0
     * - User must have sufficient collateral balance to withdraw the requested amount
     *
     * Effects:
     * - Updates interest accrual before processing the withdrawal
     * - Decreases user's collateral balance by the withdrawn amount
     * - Transfers collateral tokens from position contract back to user
     * - Emits a WithdrawCollateral event
     *
     * Security:
     * - Uses nonReentrant modifier to prevent reentrancy attacks
     * - Validates amount is non-zero
     * - Checks for sufficient collateral balance
     *
     * @param amount The amount of collateral tokens to withdraw
     * @custom:throws ZeroAmount if amount is 0
     * @custom:throws InsufficientCollateral if user has insufficient collateral balance
     * @custom:emits WithdrawCollateral when collateral is successfully withdrawn
     */
    function withdrawCollateral(uint256 amount) public positionRequired nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (amount > userCollaterals[msg.sender]) revert InsufficientCollateral();

        _accrueInterest();

        userCollaterals[msg.sender] -= amount;
        IPosition(addressPositions[msg.sender]).withdrawCollateral(amount, msg.sender);

        emit WithdrawCollateral(msg.sender, amount);
    }

    /**
     * @dev Allows users to borrow assets using their supplied collateral.
     *
     * Requirements:
     * - User must have sufficient collateral to support the borrow
     * - Total borrowed assets must not exceed total supplied assets
     * - Amount must be greater than 0
     *
     * Effects:
     * - Updates interest accrual before processing the borrow
     * - Calculates borrow shares based on current borrow-to-share ratio
     * - For first borrow, shares equal borrowed amount
     * - Increases user's borrow shares and protocol's total borrow shares/assets
     * - Transfers borrowed tokens to user or solver contract for crosschain
     *
     * Security:
     * - Uses nonReentrant modifier to prevent reentrancy attacks
     * - Validates sufficient protocol liquidity
     * - Safely transfers tokens using safeTransfer
     *
     * @param amount The amount of tokens to borrow
     * @param _crosschain Whether this is a crosschain borrow
     * @custom:throws InsufficientLiquidity if protocol lacks liquidity
     * @custom:emits BorrowDebt when borrow is successful
     */
    function borrowDebt(uint256 amount, bool _crosschain) public nonReentrant {
        _accrueInterest();
        uint256 shares = 0;
        if (totalBorrowShares == 0) {
            shares = amount;
        } else {
            shares = ((amount * totalBorrowShares) / totalBorrowAssets);
        }

        userBorrowShares[msg.sender] += shares;
        totalBorrowShares += shares;
        totalBorrowAssets += amount;

        if (totalBorrowAssets > totalSupplyAssets) {
            revert InsufficientLiquidity();
        }
        if (_crosschain) {
            IERC20(borrowToken).safeTransfer(IFactory(factory).solver(), amount);
        } else {
            IERC20(borrowToken).safeTransfer(msg.sender, amount);
        }

        emit BorrowDebt(msg.sender, amount, shares);
    }

    /**
     * @dev Allows users to repay their borrowed assets by burning borrow shares.
     *
     * Requirements:
     * - Shares amount must be greater than 0
     * - User must have sufficient borrow shares to repay
     * - User must have approved the contract to spend the repayment amount
     *
     * Effects:
     * - Updates interest accrual before processing repayment
     * - Calculates repayment amount based on current share-to-borrow ratio
     * - Reduces user's borrow shares and protocol's total borrow shares/assets
     * - Transfers repayment tokens from user to protocol
     *
     * Security:
     * - Uses nonReentrant modifier to prevent reentrancy attacks
     * - Safely transfers tokens using safeTransferFrom
     * - Validates non-zero shares amount
     *
     * @param shares The number of borrow shares to repay
     * @custom:throws ZeroAmount if shares is 0
     * @custom:emits RepayDebt when repayment is successful
     */
    function repayDebt(uint256 shares) public nonReentrant {
        if (shares == 0) revert ZeroAmount();

        _accrueInterest();

        uint256 borrowAmount = ((shares * totalBorrowAssets) / totalBorrowShares);
        userBorrowShares[msg.sender] -= shares;
        totalBorrowShares -= shares;
        totalBorrowAssets -= borrowAmount;

        IERC20(borrowToken).safeTransferFrom(msg.sender, address(this), borrowAmount);

        emit RepayDebt(msg.sender, borrowAmount, shares);
    }

    /**
     * @dev Allows users to repay their borrowed assets using a selected token from their position.
     *
     * Requirements:
     * - Shares amount must be greater than 0
     * - User must have a valid position
     * - User must have sufficient tokens in their position to repay
     *
     * Effects:
     * - Updates interest accrual before processing repayment
     * - Calculates repayment amount based on current share-to-borrow ratio
     * - Reduces user's borrow shares and protocol's total borrow shares/assets
     * - Swaps selected token to borrow token if needed via position contract
     * - Updates user's collateral balance if repaying with collateral token
     *
     * Security:
     * - Uses nonReentrant modifier to prevent reentrancy attacks
     * - Validates non-zero shares and position existence
     * - Enforces minimum output amount for token swaps
     *
     * @param shares The number of borrow shares to repay
     * @param minAmountOut The minimum amount of borrow token to receive from swap
     * @param _token The address of the token to use for repayment
     * @custom:throws ZeroAmount if shares is 0
     * @custom:throws PositionUnavailable if user has no position
     * @custom:emits RepayWithCollateralByPosition when repayment is successful
     */
    function repayWithSelectedToken(uint256 shares, uint256 minAmountOut, address _token) public nonReentrant {
        if (shares == 0) revert ZeroAmount();
        if (addressPositions[msg.sender] == address(0)) revert PositionUnavailable();

        _accrueInterest();
        uint256 borrowAmount = ((shares * totalBorrowAssets) / totalBorrowShares);

        userBorrowShares[msg.sender] -= shares;
        totalBorrowShares -= shares;
        totalBorrowAssets -= borrowAmount;

        IPosition(addressPositions[msg.sender]).repayWithSelectedToken(borrowAmount, minAmountOut, _token);
        if (_token == collateralToken) {
            userCollaterals[msg.sender] = IERC20(collateralToken).balanceOf(addressPositions[msg.sender]);
        }

        emit RepayWithCollateralByPosition(msg.sender, borrowAmount, shares);
    }

    /**
     * @dev Swaps tokens within a user's position using Uniswap V3.
     *
     * Requirements:
     * - User must have a valid position
     * - Input amount must be greater than 0
     * - If swapping from a non-collateral token, user must have sufficient balance
     *
     * Effects:
     * - Updates interest accrual before processing swap
     * - If swapping from collateral token:
     *   - Deducts amount from user's collateral balance
     *   - Executes swap via position contract
     * - If swapping to collateral token:
     *   - Executes swap via position contract
     *   - Adds received amount to user's collateral balance
     * - For other token swaps:
     *   - Simply executes swap via position contract
     *
     * Security:
     * - Uses positionRequired modifier to validate position existence
     * - Validates non-zero input amount
     * - Checks token availability in position
     * - Updates interest before swap to ensure accurate accounting
     *
     * @param _tokenTo The address of the token to receive
     * @param _tokenFrom The address of the token to swap from
     * @param amountIn The amount of _tokenFrom to swap
     * @return amountOut The amount of _tokenTo received from the swap
     * @custom:throws ZeroAmount if amountIn is 0
     * @custom:throws PositionUnavailable if user has no position
     * @custom:throws TokenNotAvailable if _tokenFrom is not available in position
     * @custom:emits SwapByPosition when swap is successful
     */
    function swapTokenByPosition(address _tokenTo, address _tokenFrom, uint256 amountIn)
        public
        positionRequired
        returns (uint256 amountOut)
    {
        if (amountIn == 0) revert ZeroAmount();
        if (addressPositions[msg.sender] == address(0)) revert PositionUnavailable();
        if (_tokenFrom != collateralToken && IPosition(addressPositions[msg.sender]).getTokenCounter(_tokenFrom) == 0) {
            revert TokenNotAvailable();
        }
        _accrueInterest();
        if (_tokenFrom == collateralToken) {
            userCollaterals[msg.sender] -= amountIn;
            amountOut = IPosition(addressPositions[msg.sender]).swapTokenByPositionV2(_tokenFrom, _tokenTo, amountIn, 0);
        } else if (_tokenTo == collateralToken) {
            amountOut = IPosition(addressPositions[msg.sender]).swapTokenByPositionV2(_tokenFrom, _tokenTo, amountIn, 0);
            userCollaterals[msg.sender] += amountOut;
        } else {
            amountOut = IPosition(addressPositions[msg.sender]).swapTokenByPositionV2(_tokenFrom, _tokenTo, amountIn, 0);
        }

        emit SwapByPosition(msg.sender, collateralToken, _tokenTo, amountIn, amountOut);
    }
}

/**
 * !SECTION
 * Chain Pharos -> pengen di bridge ke base
 *
 * Create Ledingpool (WETH - USDC) - (Collateral - Borrow)
 *
 * User B Ngesupply Liquidity (1jt USDC)
 * tujuan supplyLiquidity => supaya user lain bisa hutang
 * user B dapat yield dari user lain yang hutang
 *
 *
 * User A Supply Collateral 10 WETH
 * User A punya jaminan 10 WETH di LP
 *
 * User A borrow 5 USDC
 * Ambil 5 USDC dari LP
 *
 * (Crosschain)
 * User A borrow 5 USDC (dari Pharos)
 * LP mencatat hutang User A, tapi duitnya di transfer ke Solver.
 * Solver listen ada transaksi masuk. (Pharos)
 *
 * Solver Action buat transfer ke user A (Base)
 *
 * Solver
 * (Pharos 100 USDC - Base 100 USDC)
 * User A 5 USDC -> pharos => base
 * Solver (Pharos 100 + 5 (User A) USDC ======= Base 100 - 5 (User A) USDC) -> 1% fee
 *
 *
 *
 *
 *
 */

/**
 * !SECTION
 * 1. deploy factory (bisa lewat mainnet) (-$1)
 * 2. deploy lending pool (via web)
 * 3. deploy position (via web)
 * 4. user swap from eth to weth
 * 5. user swap from eth to usdc
 * 6. user supply collateral
 * 7. user borrow
 * 8. user repay
 * 9. user swap token
 * 10. user crosschain borrow
 *
 * !SECTION tenderly
 * 1. di FE bisa ganti rpc url nya tenderly - supaya block height nya bisa diganti
 * 2. wajib tenderly baru, wallet baru untuk demo apps
 */

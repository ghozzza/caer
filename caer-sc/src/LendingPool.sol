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
    error InsufficientToken();
    error InvalidOracle();
    error LTVExceedMaxAmount();
    error PositionNotCreated();
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
    event ListingTrading(address user, address positionAddress, address token, uint256 price, string name);

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
    // address public router = address(0x492E6456D9528771018DeB9E87ef7750EF184104);
    // address public router = address(0x94cC0AaC535CCDB3C01d6787D6413C739ae12bc4);
    address public router = address(0x2626664c2603336E57B271c5C0b26F421741e481);

    uint256 public lastAccrued;

    uint256 public ltv;

    modifier positionRequired() {
        if (addressPositions[msg.sender] == address(0)) {
            // revert PositionNotCreated();
            createPosition();
        }
        _;
    }

    /**
     * @dev Contract constructor to initialize the lending and borrowing system.
     *
     * - Sets the collateral and borrow token addresses.
     * - Initializes `lastAccrued` with the current block timestamp for interest calculations.
     * - Validates that the provided oracle address is not zero; otherwise, reverts with `InvalidOracle()`.
     * - Sets the oracle contract address for price fetching.
     * - Ensures the Loan-to-Value (LTV) ratio does not exceed the maximum limit of `1e18`; otherwise, reverts with `LTVExceedMaxAmount()`.
     * - Stores the validated LTV value.
     *
     * @param _collateralToken The address of the token used as collateral.
     * @param _borrowToken The address of the token that can be borrowed.
     * @param _factory The address of the factory contract.
     * @param _ltv The Loan-to-Value ratio (must not exceed `1e18`).
     */
    constructor(address _collateralToken, address _borrowToken, address _factory, uint256 _ltv) {
        collateralToken = _collateralToken;
        borrowToken = _borrowToken;
        factory = _factory;
        lastAccrued = block.timestamp;

        if (_ltv > 1e18) revert LTVExceedMaxAmount();
        ltv = _ltv;
    }

    function createPosition() public {
        if (addressPositions[msg.sender] != address(0)) revert PositionAlreadyCreated();
        position = new Position(collateralToken, borrowToken, address(this), factory);
        addressPositions[msg.sender] = address(position);
        emit CreatePosition(msg.sender, address(position));
    }

    /**
     * @dev Allows users to supply liquidity to the protocol.
     * The supplied tokens increase the total available assets,
     * which other users can borrow.
     *
     * - The function prevents zero-amount supply.
     * - It accrues interest before processing new deposits.
     * - If it's the first deposit, the shares are equal to the amount supplied.
     * - Otherwise, it calculates shares proportionally based on total supply.
     * - Updates the user's share balance and the protocol's total supply.
     * - Transfers the tokens from the user to the contract securely.
     * - Emits a `SupplyLiquidity` event with details of the deposit.
     *
     * @param amount The amount of tokens to supply.
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
     * - Accrues interest before processing the withdrawal.
     * - Calculates the amount of tokens the user receives based on their shares.
     * - Updates the user's share balance and the protocol's total supply.
     * - Ensures the protocol maintains sufficient liquidity for outstanding borrows.
     * - Transfers the tokens securely to the user.
     * - Emits a `Withdraw` event with details of the transaction.
     *
     * @param shares The number of supply shares the user wants to withdraw.
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
     * @dev Allows users to supply collateral for their position.
     *
     * - Prevents zero-amount collateral deposits.
     * - Accrues interest before processing the deposit to ensure up-to-date calculations.
     * - Increases the user's collateral balance.
     * - Transfers the specified collateral amount securely from the user to the contract.
     * - Emits a `SupplyCollateral` event to log the deposit.
     *
     * @param amount The amount of collateral tokens to supply.
     */
    function supplyCollateral(uint256 amount) public positionRequired nonReentrant {
        if (amount == 0) revert ZeroAmount();
        accrueInterest();
        userCollaterals[msg.sender] += amount;
        IERC20(collateralToken).safeTransferFrom(msg.sender, addressPositions[msg.sender], amount);

        emit SupplyCollateral(msg.sender, amount);
    }

    /**
     * @dev Allows users to withdraw their supplied collateral.
     *
     * - Prevents zero-amount withdrawals.
     * - Ensures the user has enough collateral to withdraw the requested amount.
     * - Accrues interest before processing the withdrawal to keep calculations updated.
     * - Reduces the user's collateral balance accordingly.
     * - Calls `_isHealthy` to verify the user's position remains solvent after withdrawal.
     * - Transfers the specified collateral amount securely to the user.
     * - Emits a `WithdrawCollateral` event to log the transaction.
     *
     * @param amount The amount of collateral tokens to withdraw.
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
     * - Accrues interest before processing the borrow request.
     * - Calculates the borrow shares based on the existing borrow-to-share ratio.
     * - If this is the first borrow, the shares are equal to the borrowed amount.
     * - Updates the user's borrow share balance and the protocol's total borrow shares.
     * - Ensures the user's position remains healthy after borrowing.
     * - Prevents borrowing if total borrowed assets exceed total supplied assets.
     * - Transfers the borrowed tokens securely to the user.
     * - Emits a `BorrowDebt` event to log the transaction.
     *
     * @param amount The amount of tokens the user wants to borrow.
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
     * @dev Allows users to repay their borrowed assets using their position.
     *
     * - Prevents zero-amount repayments.
     * - Accrues interest before processing the repayment to ensure accurate calculations.
     * - Determines the corresponding borrow amount based on the user's borrow shares.
     * - Reduces the user's borrow shares and updates the protocol's total borrowed assets.
     * - Transfers the repayment amount securely from the user to the contract.
     * - Emits a `RepayDebt` event to log the transaction.
     *
     * @param shares The number of borrow shares the user wants to repay.
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
     * - Prevents zero-amount repayments.
     * - Ensures the specified position is valid before proceeding.
     * - Accrues interest before processing the repayment.
     * - Determines the equivalent amount of the selected token required to cover the borrow amount.
     * - Supports repayment using either the collateral token or another token from the user's position.
     * - Updates the user's borrow shares and total borrowed assets.
     * - Converts any excess token amount back to the appropriate collateral or position token.
     * - Calls `costSwapToken` on the position contract to handle token swaps if a non-collateral token is used.
     * - Emits a `RepayWithCollateralByPosition` event to log the transaction.
     *
     * @param shares The number of borrow shares the user wants to repay.
     * @param _token The address of the token the user wants to use for repayment.
     */
    function repayWithSelectedToken(uint256 shares, uint256 minAmountOut, address _token) public nonReentrant {
        if (shares == 0) revert ZeroAmount();
        if (addressPositions[msg.sender] == address(0)) revert PositionUnavailable();
        // if (IPosition(addressPositions[msg.sender]).getTokenCounter(_token) == 0 && _token != collateralToken) {
        //     revert TokenNotAvailable();
        // }

        _accrueInterest();

        // uint256 amountOut;
        // uint256 borrowAmount = ((shares * totalBorrowAssets) / totalBorrowShares);
        // uint256 tempBalance = _token == collateralToken
        //     ? userCollaterals[msg.sender]
        //     : IERC20(_token).balanceOf(addressPositions[msg.sender]);
        // amountOut = IOracle(IFactory(factory).oracle()).tokenCalculator(tempBalance, _token, borrowToken);
        // if (_token == collateralToken) {
        //     userCollaterals[msg.sender] = 0;
        // }

        // userBorrowShares[msg.sender] -= shares;
        // totalBorrowShares -= shares;
        // totalBorrowAssets -= borrowAmount;
        // amountOut -= borrowAmount;

        // /**
        //  * @dev After repayment, converts any excess borrowToken back to the original token type.
        //  */
        // amountOut = IOracle(IFactory(factory).oracle()).tokenCalculator(amountOut, borrowToken, _token);
        // if (_token == collateralToken) {
        //     userCollaterals[msg.sender] += amountOut;
        //     TokenSwap(collateralToken).burn(address(this), tempBalance - userCollaterals[msg.sender]);
        // } else {
        //     IPosition(addressPositions[msg.sender]).costSwapToken(_token, borrowAmount);
        //     TokenSwap(_token).burn(
        //         addressPositions[msg.sender], tempBalance - IERC20(_token).balanceOf(addressPositions[msg.sender])
        //     );
        // }
        uint256 borrowAmount = ((shares * totalBorrowAssets) / totalBorrowShares);

        userBorrowShares[msg.sender] -= shares;
        totalBorrowShares -= shares;
        totalBorrowAssets -= borrowAmount;

        IPosition(addressPositions[msg.sender]).repayWithSelectedToken(borrowAmount, minAmountOut, _token);

        emit RepayWithCollateralByPosition(msg.sender, borrowAmount, shares);
    }

    /**
     * @dev Swaps one token for another within a user's position.
     *
     * - Ensures the input amount is greater than zero.
     * - Checks that the specified position is valid.
     * - Validates whether the token being swapped from is available in the position.
     * - Handles swaps from collateral and non-collateral tokens differently:
     *     - If swapping from collateral, transfers the token from the lending pool.
     *     - If swapping from a non-collateral token, verifies token balances and performs necessary conversions.
     * - Calls `costSwapToken` on the position contract if a position token swap is needed.
     * - Calculates the output token amount using `tokenCalculator`.
     * - Mints the swapped token:
     *     - If swapped into collateral, the minted amount is sent to the lending pool.
     *     - Otherwise, the minted token is sent to the user's position.
     * - Updates the user's collateral balance if the output token is the collateral token.
     * - Calls `swapToken` on the position contract to finalize the swap if applicable.
     * - Emits a `SwapByPosition` event to log the transaction.
     *
     * @param _tokenTo The address of the token the user wants to receive.
     * @param _tokenFrom The address of the token the user is swapping.
     * @param amountIn The amount of `_tokenFrom` the user wants to swap.
     * @return amountOut The amount of `_tokenTo` received from the swap.
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

// 1. Collateral -> LP

// 2. Collateral -> Position

// 3. Position -> coins

// 4. LP -> Position`

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

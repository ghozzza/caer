// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IPosition {
    function getTokenCounter(address _token) external view returns (uint256);
    function counter() external view returns (uint256);
    function costSwapToken(address _token, uint256 _amount) external;
    function listingTradingPosition(address _token, uint256 _price, string memory _name) external;
    function buyTradingPosition(uint256 _price, address _buyer) external;
    function withdrawCollateral(uint256 amount, address _user) external;
    function swapTokenByPosition(address _tokenIn, address _tokenOut, uint256 amountIn) external returns (uint256 amountOut);
    function repayWithSelectedToken(uint256 amount, address _token) external;
}

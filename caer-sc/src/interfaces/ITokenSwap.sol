// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface ITokenSwap {
    function mint_mock(address _to, uint256 _amount) external;
    function burn_mock(uint256 _amount) external;
}
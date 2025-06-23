// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {LendingPool} from "./LendingPool.sol";

contract LendingPoolFactory {
    event LendingPoolCreated(address indexed collateralToken, address indexed borrowToken, address lendingPool, uint256 LTV);
    event TokenDataStreamAdded(address indexed token, address indexed dataStream);
    event BasicTokenSenderAdded(uint256 indexed chainId, address indexed basicTokenSender);

    struct Pools {
        address collateralToken;
        address borrowToken;
        address lendingPoolAddress;
    }

    address public owner;
    mapping(uint256 => address) public basicTokenSender;
    mapping(address => address) public tokenDataStream;
    Pools[] public pools;
    uint256 public poolCount;


    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createLendingPool(address collateralToken, address borrowToken, uint256 LTV)
        public
        returns (address)
    {
        LendingPool lendingPool = new LendingPool(collateralToken, borrowToken, address(this), LTV);

        pools.push(Pools(collateralToken, borrowToken, address(lendingPool)));
        poolCount++;
        emit LendingPoolCreated(collateralToken, borrowToken, address(lendingPool), LTV);
        return address(lendingPool);
    }

    function addTokenDataStream(address _token, address _dataStream) public onlyOwner {
        tokenDataStream[_token] = _dataStream;
        emit TokenDataStreamAdded(_token, _dataStream);
    }

    function addBasicTokenSender(uint256 _chainId, address _basicTokenSender) public onlyOwner {
        basicTokenSender[_chainId] = _basicTokenSender;
        emit BasicTokenSenderAdded(_chainId, _basicTokenSender);
    }
}

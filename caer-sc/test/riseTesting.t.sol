// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";

interface SupraOracle {
    function derivedPairs(uint256 _derivedPairId) external view returns (uint256, uint256, uint256);
}

interface SupraCheck {
    function checkSupraSValueFeed() external view returns (address);
}

contract RiseTesting is Test {
    address public rise_supraOracle = 0xaa2f56843Cec7840F0C106F0202313d8d8CB13d6;
    address public rise_supraCheck = 0x391Ab9ad5C4BFee04eA508b0a0Cf499198D015e3;

    address public base_supraOracle = 0x2FA6DbFe4291136Cf272E1A3294362b6651e8517;
    address public base_supraCheck = 0xD02cc7a670047b6b012556A88e275c685d25e0c9;

    address public eth_supraOracle = 0x2FA6DbFe4291136Cf272E1A3294362b6651e8517;
    address public eth_supraCheck = 0xD02cc7a670047b6b012556A88e275c685d25e0c9;


    function setUp() public {
        // vm.createSelectFork("https://testnet.riselabs.xyz", 15686504);
        // vm.createSelectFork("https://mainnet.base.org");
        vm.createSelectFork("https://eth-mainnet.g.alchemy.com/v2/Ea4M-V84UObD22z2nNlwDD9qP8eqZuSI");
        
        // 1723700893000
    }

    function test_getSupraPrice() public view {
        // (uint256 basePairId, uint256 quotePairId, uint256 operation) = SupraOracle(base_supraCheck).derivedPairs(1);
        // (uint256 basePairId, uint256 quotePairId, uint256 operation) = SupraOracle(rise_supraCheck).derivedPairs(1);
        (uint256 basePairId, uint256 quotePairId, uint256 operation) = SupraOracle(eth_supraCheck).derivedPairs(0);

        console.log("basePairId", basePairId);
        console.log("quotePairId", quotePairId);
        console.log("operation", operation);

        // address supraSValueFeed = SupraCheck(base_supraOracle).checkSupraSValueFeed();
        // address supraSValueFeed = SupraCheck(rise_supraOracle).checkSupraSValueFeed();
        address supraSValueFeed = SupraCheck(eth_supraOracle).checkSupraSValueFeed();
        console.log("supraSValueFeed", supraSValueFeed);
    }
}

// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.24;

import {BurnMintERC677} from "@chainlink/contracts/src/v0.8/shared/token/ERC677/BurnMintERC677.sol";
import {IGetCCIPAdmin} from "@chainlink/contracts/src/v0.8/ccip/interfaces/IGetCCIPAdmin.sol";

contract MockUSDC is BurnMintERC677, IGetCCIPAdmin {
    constructor() BurnMintERC677("USDC", "USDC", 6, 0) {}

    // this function for hackathon purposes
    function mint_mock(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function burn_mock(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function getCCIPAdmin() external view override returns (address) {
        return owner();
    }
}

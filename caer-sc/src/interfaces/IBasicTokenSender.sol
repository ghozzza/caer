// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IBasicTokenSender {
    struct EVMTokenAmount {
        address token; // token address on the local chain.
        uint256 amount; // Amount of tokens.
    }

    function send(
        uint64 destinationChainId,
        address receiver,
        EVMTokenAmount[] memory tokensToSendDetails,
        uint256 amount
    ) external;
}

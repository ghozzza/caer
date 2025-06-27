// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Helper {
    // Supported Networks
    enum SupportedNetworks {
        ETHEREUM_SEPOLIA, // 0
        AVALANCHE_FUJI, // 1
        ARBITRUM_SEPOLIA, // 2
        BASE_SEPOLIA // 6
    }

    mapping(SupportedNetworks enumValue => string humanReadableName) public networks;

    enum PayFeesIn {
        Native,
        LINK
    }

    // Chain IDs
    uint64 constant chainIdEthereumSepolia = 16015286601757825753;
    uint64 constant chainIdAvalancheFuji = 14767482510784806043;
    uint64 constant chainIdArbitrumSepolia = 3478487238524512106;
    uint64 constant chainIdBaseSepolia = 10344971235874465080;

    // Router addresses
    address constant routerEthereumSepolia = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
    address constant routerAvalancheFuji = 0xF694E193200268f9a4868e4Aa017A0118C9a8177;
    address constant routerArbitrumSepolia = 0x2a9C5afB0d0e4BAb2BCdaE109EC4b0c4Be15a165;
    address constant routerBaseSepolia = 0xD3b06cEbF099CE7DA4AcCf578aaebFDBd6e88a93;

    // Link addresses (can be used as fee)
    address constant linkEthereumSepolia = 0x779877A7B0D9E8603169DdbD7836e478b4624789;
    address constant linkAvalancheFuji = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;
    address constant linkArbitrumSepolia = 0xb1D4538B4571d411F07960EF2838Ce337FE1E80E;
    address constant linkBaseSepolia = 0xE4aB69C077896252FAFBD49EFD26B5D171A32410;

    constructor() {
        networks[SupportedNetworks.ETHEREUM_SEPOLIA] = "Ethereum Sepolia";
        networks[SupportedNetworks.AVALANCHE_FUJI] = "Avalanche Fuji";
        networks[SupportedNetworks.ARBITRUM_SEPOLIA] = "Arbitrum Sepolia";
        networks[SupportedNetworks.BASE_SEPOLIA] = "Base Sepolia";
    }

    function getConfigFromNetwork(SupportedNetworks network)
        internal
        pure
        returns (address router, address linkToken, address wrappedNative, uint64 chainId)
    {
        if (network == SupportedNetworks.ETHEREUM_SEPOLIA) {
            return (routerEthereumSepolia, linkEthereumSepolia, address(0), chainIdEthereumSepolia);
        } else if (network == SupportedNetworks.ARBITRUM_SEPOLIA) {
            return (routerArbitrumSepolia, linkArbitrumSepolia, address(0), chainIdArbitrumSepolia);
        } else if (network == SupportedNetworks.AVALANCHE_FUJI) {
            return (routerAvalancheFuji, linkAvalancheFuji, address(0), chainIdAvalancheFuji);
        } else if (network == SupportedNetworks.BASE_SEPOLIA) {
            return (routerBaseSepolia, linkBaseSepolia, address(0), chainIdBaseSepolia);
        }
    }
}

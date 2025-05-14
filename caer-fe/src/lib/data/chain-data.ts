import { defineChain } from "viem";

export const eduChain = defineChain({
  id: 656476,
  name: "EDU Chain",
  nativeCurrency: { name: "EDU", symbol: "EDU", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.open-campus-codex.gelato.digital"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://edu-chain-testnet.blockscout.com",
    },
  },
  testnet: true,
  iconBackground: "#ffff",
  iconUrl: "/edu.png",
});


export const pharosChain = defineChain({
  id: 50002,
  name: "Pharos Devnet",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://devnet.dplabs-internal.com/"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://pharosscan.xyz/",
    },
  },
  testnet: true,
  iconBackground: "#ffff",
  iconUrl: "/pharos-logo.jpg"
});

export const optimismSepolia = defineChain({
  id: 11155420,
  name: "Pharos",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://sepolia.optimism.io/"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://optimism-sepolia.blockscout.com/",
    },
  },
  testnet: true,
  iconBackground: "#ffff",
  iconUrl: "/pharos-logo.jpg"
});

export const baseMainnet = defineChain({
  id: 8453,
  name: "Base",
  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    
    default: { http: ["https://virtual.base.rpc.tenderly.co/78cea8f4-da62-4444-b5f6-01ebb02fb27c"] },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://basescan.org/",
    },
  },
  testnet: false,
  iconBackground: "#ffff",
  iconUrl: "/base-logo.png"
})
import dotenv from "dotenv";
import { arbitrumSepolia, eduChain, optimismSepolia, pharos } from "../chains";
import {
  arbitrumContract,
  eduChainContract,
  eduPricefeed,
  optimismSepoliaContract,
  optimismSepoliaPricefeed,
  pharosContract,
  pharosPricefeed,
  pricefeed,
} from "../contracts";
import { TOKEN_OPTIONS } from "../../constants/tokenOption";
import { chain_id, mockWeth } from "../../constants/address";

dotenv.config();

export const config = {
  PORT: process.env.PORT ?? 4000,
  WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
  ARBITRUM_RPC: "https://sepolia-rollup.arbitrum.io/rpc",
  CHAIN: arbitrumSepolia,
  CONTRACTS: {
    arbitrum: arbitrumContract,
    pricefeed,
  },
  TOKENS: {
    options: TOKEN_OPTIONS,
    mockWeth,
  },
};

export const configEduChain = {
  PORT: process.env.PORT ?? 4000,
  WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
  RPC_URL: "https://rpc.open-campus-codex.gelato.digital",
  CHAIN: eduChain,
  CONTRACTS: {
    eduChain: eduChainContract,
    eduPricefeed,
  },
  TOKENS: {
    options: TOKEN_OPTIONS,
    mockWeth,
  },
};

export const configPharos = {
  PORT: process.env.PORT ?? 4000,
  WALLET_PRIVATE_KEY: process.env.WALLET_PRIVATE_KEY as `0x${string}`,
  RPC_URL: chain_id === 50002 ? "https://devnet.dplabs-internal.com/" : "https://sepolia.optimism.io",
  CHAIN: chain_id === 50002 ? pharos : optimismSepolia,
  CONTRACTS: {
    pharos: chain_id === 50002 ? pharosContract : optimismSepoliaContract,
    pharosPricefeed: chain_id === 50002 ? pharosPricefeed : optimismSepoliaPricefeed,
  },
  TOKENS: {
    options: TOKEN_OPTIONS,
    mockWeth,
  },
};

import { Token } from "@/types/type";

export const tokens: Token[] = [
  {
    name: "WETH",
    symbol: "WETH",
    logo: "/token/weth.png",
    decimals: 18,
    addresses: {
      11155111: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      43113: "0x63CFd5c58332c38d89B231feDB5922f5817DF180",
      421614: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      84532: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    },
  },
  {
    name: "WBTC",
    symbol: "WBTC",
    logo: "/token/wbtc.png",
    decimals: 8,
    addresses: {
      11155111: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      43113: "0xa7A93C5F0691a5582BAB12C0dE7081C499aECE7f",
      421614: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      84532: "0x4200000000000000000000000000000000000006",
    },
  },
  {
    name: "WAVAX",
    symbol: "WAVAX",
    logo: "/chain/avax-logo.png",
    decimals: 18,
    addresses: {
      11155111: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      43113: "0xA61Eb0D33B5d69DC0D0CE25058785796296b1FBd",
      421614: "0x55d398326f99059fF775485246999027B3197955",
      84532: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    },
  },
  {
    name: "USDC",
    symbol: "USDC",
    logo: "/token/usdc.png",
    decimals: 6,
    addresses: {
      11155111: "0xab0c196dba12297e4c5b9a414013230a527b4a4b",
      43113: "0xC014F158EbADce5a8e31f634c0eb062Ce8CDaeFe",
      421614: "0x55d398326f99059fF775485246999027B3197955",
      84532: "0xcba01c75d035ca98ffc7710dae710435ca53c03c",
    },
  },
  {
    name: "USDT",
    symbol: "USDT",
    logo: "/token/usdt.png",
    decimals: 6,
    addresses: {
      11155111: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      43113: "0x1E713E704336094585c3e8228d5A8d82684e4Fb0",
      421614: "0x55d398326f99059fF775485246999027B3197955",
      84532: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
    },
  },
];

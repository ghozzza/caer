import { Token } from "@/types/type";

export const tokens: Token[] = [
  {
    name: "WETH",
    symbol: "WETH",
    logo: "/usdc.png",
    decimals: 18,
    addresses: {
      43113: "0x63CFd5c58332c38d89B231feDB5922f5817DF180",
      1: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      137: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      10: "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
      42161: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
      8453: "0xd9AAEC86B65d86F6A7B5B1b0c42FFA531710b6CA",
    },
  },
  {
    name: "WETC",
    symbol: "WBTC",
    logo: "/weth.png",
    decimals: 8,
    addresses: {
      43113: "0xa7A93C5F0691a5582BAB12C0dE7081C499aECE7f",
      137: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
      42161: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
      10: "0x4200000000000000000000000000000000000006",
      8453: "0x4200000000000000000000000000000000000006",
    },
  },
  {
    name: "WAVAX",
    symbol: "WAVAX",
    logo: "/usdt.png",
    decimals: 18,
    addresses: {
      43113: "0xA61Eb0D33B5d69DC0D0CE25058785796296b1FBd",
      137: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      56: "0x55d398326f99059fF775485246999027B3197955",
      43114: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      10: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
  },
  {
    name: "USDC",
    symbol: "USDC",
    logo: "/usdt.png",
    decimals: 6,
    addresses: {
      43113: "0xC014F158EbADce5a8e31f634c0eb062Ce8CDaeFe",
      137: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      56: "0x55d398326f99059fF775485246999027B3197955",
      43114: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      10: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
  },
  {
    name: "USDT",
    symbol: "USDT",
    logo: "/usdt.png",
    decimals: 6,
    addresses: {
      43113: "0x1E713E704336094585c3e8228d5A8d82684e4Fb0",
      137: "0x3813e82e6f7098b9583FC0F33a962D02018B6803",
      56: "0x55d398326f99059fF775485246999027B3197955",
      43114: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
      10: "0x7f5c764cbc14f9669b88837ca1490cca17c31607",
      42161: "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9",
    },
  },
];

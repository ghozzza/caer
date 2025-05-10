import { mockWbtc, mockWeth, mockUsdc, mockUsdt, mockPaxg } from "./address";

export interface TokenOption {
  name: string;
  namePrice: string;
  address: string;
  decimals: number;
}

export const TOKEN_OPTIONS: TokenOption[] = [
  {
    name: "WETH",
    namePrice: "ETH",
    address: mockWeth,
    decimals: 18,
  },
  {
    name: "WBTC",
    namePrice: "BTC",
    address: mockWbtc,
    decimals: 8,
  },
  {
    name: "USDC",
    namePrice: "USDC",
    address: mockUsdc,
    decimals: 6,
  },
  {
    name: "USDT",
    namePrice: "USDT",
    address: mockUsdt,
    decimals: 6,
  },
  {
    name: "PAXG",
    namePrice: "PAXG",
    address: mockPaxg,
    decimals: 18,
  },
];

import { Token } from "@/types/type";

export const tokens: Token[] = [
  {
    name: "ETH",
    symbol: "ETH",
    address: "0x0000000000000000000000000000000000000000",
    logo: "/placeholder.svg?height=40&width=40",
    chainIds: [1, 10, 42161, 8453],
  },
  {
    name: "WETH",
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logo: "/weth.png",
    chainIds: [1, 10, 42161, 8453, 137],
  },
  {
    name: "USDT",
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    logo: "/usdt.png",
    chainIds: [1, 56, 137, 43114, 10, 42161],
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "usdc.png",
    logo: "/placeholder.svg?height=40&width=40",
    chainIds: [1, 10, 42161, 8453, 137, 43114],
  },
  {
    name: "DAI Stablecoin",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    logo: "/placeholder.svg?height=40&width=40",
    chainIds: [1, 137, 10, 42161],
  },
  {
    name: "WBTC",
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    logo: "/wbtc.png",
    chainIds: [1, 10, 42161, 137],
  },
];

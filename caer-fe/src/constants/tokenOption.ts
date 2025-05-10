import { mockBnvda, mockPaxg, mockSaapl, mockUsdc, mockUsdt, mockWbtc, mockWeth } from "./addresses";
import usdc from "../../public/usdc.png";
import weth from "../../public/weth.png";
import wbtc from "../../public/wbtc.png";
import usdt from "../../public/usdt.png";
import bnvda from "../../public/bnvda.png";
import paxg from "../../public/paxg.png";
import saapl from "../../public/saapl.png";
export interface TokenOption {
  name: string;
  namePrice: string;
  address: string;
  logo: string;
  decimals: number;
}

export const TOKEN_OPTIONS: TokenOption[] = [
  {
    name: "WETH",
    namePrice: "ETH",
    address: mockWeth,
    logo: weth.src,
    decimals: 18,
  },
  {
    name: "WBTC",
    namePrice: "BTC",
    address: mockWbtc,
    logo: wbtc.src,
    decimals: 8,
  },
  {
    name: "USDC",
    namePrice: "USDC",
    address: mockUsdc,
    logo: usdc.src,
    decimals: 6,
  },
  {
    name: "USDT",
    namePrice: "USDT",
    address: mockUsdt,
    logo: usdt.src,
    decimals: 6,
  },
  {
    name: "bNVDA",
    namePrice: "NVDA",
    address: mockBnvda,
    logo: bnvda.src,
    decimals: 18,
  },
  {
    name: "sAAPL",
    namePrice: "AAPL",
    address: mockSaapl,
    logo: saapl.src,
    decimals: 18,
  },
  {
    name: "PAXG",
    namePrice: "PAXG",
    address: mockPaxg,
    logo: paxg.src,
    decimals: 18,
  },
];

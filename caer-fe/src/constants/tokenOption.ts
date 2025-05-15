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
    name: "USDC",
    namePrice: "USDC",
    address: mockUsdc,
    logo: usdc.src,
    decimals: 6,
  },
];


import { chains } from "@/constants/chain-address";
import { tokens } from "@/constants/token-address";
import { positionAbi } from "@/lib/abis/positionAbi";
import { Address } from "viem";
import { useReadContract } from "wagmi";

export const useTokenCalculator = (tokenIn: Address, tokenOut: Address, amountIn: number, addressPosition: Address) => {
  const decimalsIn = tokens.find((token) => token.addresses[43113] === tokenIn)?.decimals;
  const decimalsOut = tokens.find((token) => token.addresses[43113] === tokenOut)?.decimals;
  const amountInBigInt = BigInt(amountIn * 10 ** (decimalsIn ?? 0));
  const tokenInPrice = tokens.find((token) => token.addresses[43113] === tokenIn)?.priceFeed as Address;
  const tokenOutPrice = tokens.find((token) => token.addresses[43113] === tokenOut)?.priceFeed as Address;
  
  const { data: price, isLoading, error } = useReadContract({
    address: chains[1].contracts.position as Address,
    abi: positionAbi,
    functionName: "tokenCalculator",
    args: [tokenIn, tokenOut, amountInBigInt, tokenInPrice, tokenOutPrice],
  });

  return {
    price: price ? Number(price) / 10 ** (decimalsOut ?? 0) : 0,
    isLoading: isLoading,
    error: error,
  };
};

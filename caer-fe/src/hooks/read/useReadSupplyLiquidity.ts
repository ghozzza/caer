"use client";

import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";
import { chains } from "@/constants/chain-address";
import { useReadContract } from "wagmi";
import { getTokenDecimals } from "@/lib/tokenUtils";

export const useReadSupplyLiquidity = ({
  tokenAddress,
  chainId = 43113,
  lpAddress,
}: {
  tokenAddress?: string;
  chainId?: number;
  lpAddress?: string;
}) => {
  const decimals = getTokenDecimals(tokenAddress ?? "", chainId) ?? 6;
  const address = tokenAddress as `0x${string}`;

  const { data: supplyLiquidity } = useReadContract({
    address,
    abi: mockErc20Abi,
    functionName: "balanceOf",
    args: [lpAddress as `0x${string}`],
  });

  return {
    tokenAddress,
    supplyLiquidity: supplyLiquidity
      ? Number(supplyLiquidity) / 10 ** decimals
      : "0.00",
  };
};

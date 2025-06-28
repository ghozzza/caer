"use client";

import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";
import { chains } from "@/constants/chain-address";
import { useReadContract } from "wagmi";
import { getTokenDecimals } from "@/lib/tokenUtils";
import { useEffect } from "react";

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

  const { data: supplyLiquidity, refetch } = useReadContract({
    address,
    abi: mockErc20Abi,
    functionName: "balanceOf",
    args: [lpAddress as `0x${string}`],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  return {
    tokenAddress,
    supplyLiquidity: supplyLiquidity
      ? Number(supplyLiquidity) / 10 ** decimals
      : "0.00",
  };
};

"use client";

import { useAccount, useReadContract } from "wagmi";
import { formatUnits } from "viem/utils";
import { useState, useEffect } from "react";
import { Address } from "viem";
import { erc20Abi } from "viem";

export const useBalance = (tokenAddress: Address, decimals: number) => {
  const { address } = useAccount();
  const [balance, setBalance] = useState("0");

  const { data, isLoading, refetch } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (data) {
      const formattedBalance = parseFloat(
        formatUnits(data as bigint, decimals)
      ).toFixed(decimals === 6 ? 2 : 4);
      setBalance(formattedBalance);
    }
  }, [data, decimals]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  return {
    balance,
    isLoading,
    rawBalance: data,
  };
};

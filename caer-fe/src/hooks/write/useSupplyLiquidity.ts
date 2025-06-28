"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { tokens } from "@/constants/token-address";
import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";

const getTokenDecimals = (tokenAddress?: string): number => {
  if (!tokenAddress) return 6;
  const token = tokens.find((token) =>
    Object.values(token.addresses).some(
      (addr) => addr.toLowerCase() === tokenAddress.toLowerCase()
    )
  );
  return token?.decimals ?? 6;
};

export const useSupply = (borrowToken?: string, lpAddress?: string) => {
  const [error, setError] = useState<Error | null>(null);
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  const supply = async (amount: string) => {
    setError(null);
    if (!lpAddress) {
      setError(new Error("Missing pool address"));
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setError(new Error("Invalid supply amount"));
      return;
    }

    const decimals = getTokenDecimals(borrowToken);
    const amountBigInt = BigInt(Math.floor(Number(amount) * 10 ** decimals));

    try {
      await writeContract({
        abi: poolAbi,
        address: lpAddress as `0x${string}`,
        functionName: "supplyLiquidity",
        args: [amountBigInt],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Supply failed. Please try again.")
      );
    }
  };

  return {
    supply,
    hash,
    isPending,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
};
export const useApproveToken = (
  tokenAddress?: string,
  spenderAddress?: string
) => {
  const [error, setError] = useState<Error | null>(null);
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (amount: string) => {
    setError(null);
    if (!tokenAddress || !spenderAddress) {
      setError(new Error("Missing token or spender address"));
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      setError(new Error("Invalid approve amount"));
      return;
    }

    const decimals = getTokenDecimals(tokenAddress);
    const amountBigInt = BigInt(Math.floor(Number(amount) * 10 ** decimals));

    try {
      await writeContract({
        abi: mockErc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, amountBigInt],
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Approval failed. Please try again.")
      );
    }
  };

  return {
    approve,
    hash,
    isPending,
    isLoading,
    isSuccess,
    isError,
    error,
    reset,
  };
};

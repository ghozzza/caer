"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { tokens } from "@/constants/token-address";
import { poolAbi } from "@/lib/abis/poolAbi";
import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";
import { useReadUserBorrowShares } from "../read/useReadUserBorrowShares";
import { useReadTotalBorrowAssets } from "../read/useReadTotalBorrowAssets";
import { useReadTotalBorrowShares } from "../read/useReadTotalBorrowShares";

const getTokenAddress = (borrowToken?: string): string | undefined => {
  if (!borrowToken) return undefined;
  const token = tokens.find((t) => t.name === borrowToken);
  return token?.addresses[43113]; // Using Avalanche testnet address
};

const getTokenDecimals = (borrowToken?: string): number => {
  if (!borrowToken) return 6;
  const token = tokens.find((t) => t.name === borrowToken);
  return token?.decimals ?? 6;
};

export const useRepay = (
  borrowToken?: string,
  lpAddress?: string,
  condition?: boolean
) => {
  const [error, setError] = useState<Error | null>(null);
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  const {
    userBorrowShares,
    isLoadingUserBorrowShares,
    refetchUserBorrowShares,
  } = useReadUserBorrowShares(lpAddress as `0x${string}`);

  const {
    totalBorrowAssets,
    isLoadingTotalBorrowAssets,
    refetchTotalBorrowAssets,
  } = useReadTotalBorrowAssets(lpAddress as `0x${string}`);

  const {
    totalBorrowShares,
    isLoadingTotalBorrowShares,
    refetchTotalBorrowShares,
  } = useReadTotalBorrowShares(lpAddress as `0x${string}`);

  const repay = async (
    amount: string,
    totalAssets?: string,
    totalShares?: string
  ) => {
    setError(null);

    const tokenAddress = getTokenAddress(borrowToken);

    if (!tokenAddress || !lpAddress) {
      const error = new Error("Missing token or pool address");
      console.error("❌ Repay error:", error.message, {
        tokenAddress,
        lpAddress,
        borrowToken,
      });
      setError(error);
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      const error = new Error("Invalid repay amount");
      console.error("❌ Repay error:", error.message, { amount });
      setError(error);
      return;
    }

    const decimals = getTokenDecimals(borrowToken);
    const userAmount = Number(amount) * 10 ** Number(decimals);
    const userShares = Math.round(
      (Number(userAmount) * Number(totalBorrowAssets)) /
        Number(totalBorrowShares) 
    );

    try {
      await writeContract({
        address: lpAddress as `0x${string}`,
        abi: poolAbi,
        functionName: "repayWithSelectedToken",
        args: [
          BigInt(userShares),
          tokenAddress as `0x${string}`,
          false,
        ],
      });
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Repay failed. Please try again.");

      setError(error);
    }
  };

  return {
    repay,
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
  borrowToken?: string,
  spenderAddress?: string
) => {
  const [error, setError] = useState<Error | null>(null);
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (amount: string) => {
    setError(null);

    const tokenAddress = getTokenAddress(borrowToken);

    if (!tokenAddress || !spenderAddress) {
      const error = new Error("Missing token or spender address");
      console.error("❌ Approval error:", error.message, {
        tokenAddress,
        spenderAddress,
        borrowToken,
      });
      setError(error);
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      const error = new Error("Invalid approve amount");
      console.error("❌ Approval error:", error.message, { amount });
      setError(error);
      return;
    }

    const decimals = getTokenDecimals(borrowToken);
    const approvalAmount = Number(amount) * 1.1;
    const amountBigInt = BigInt(Math.floor(approvalAmount * 10 ** decimals));

    try {
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: mockErc20Abi,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, amountBigInt],
      });
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Approval failed. Please try again.");
      console.error("❌ Approval transaction failed:", error.message, err);
      setError(error);
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

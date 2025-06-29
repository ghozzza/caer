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
  const decimals = token?.decimals ?? 6;
  console.log("🔍 getTokenDecimals:", { tokenAddress, decimals, token });
  return decimals;
};

export const useSupply = (borrowToken?: string, lpAddress?: string) => {
  const [error, setError] = useState<Error | null>(null);
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({
    hash,
  });

  console.log("📊 useSupply hook state:", {
    borrowToken,
    lpAddress,
    hash,
    isPending,
    isLoading,
    isSuccess,
    isError,
    error: error?.message,
  });

  const supply = async (amount: string) => {
    console.log("🚀 Starting supply transaction:", { amount, borrowToken, lpAddress });
    setError(null);
    if (!lpAddress) {
      const error = new Error("Missing pool address");
      console.error("❌ Supply error:", error.message);
      setError(error);
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      const error = new Error("Invalid supply amount");
      console.error("❌ Supply error:", error.message, { amount });
      setError(error);
      return;
    }

    const decimals = getTokenDecimals(borrowToken);
    const amountBigInt = BigInt(Math.floor(Number(amount) * 10 ** decimals));
    
    console.log("💰 Supply calculation:", {
      originalAmount: amount,
      decimals,
      calculatedAmount: amountBigInt.toString(),
      multiplier: 10 ** decimals,
    });

    try {
      console.log("📝 Writing supply contract:", {
        abi: "poolAbi",
        address: lpAddress,
        functionName: "supplyLiquidity",
        args: [amountBigInt.toString()],
      });
      
      console.log("🔧 Supply contract arguments:", {
        address: lpAddress,
        functionName: "supplyLiquidity",
        args: [
          {
            value: amountBigInt.toString(),
            type: "bigint",
            originalAmount: amount,
            decimals: decimals
          }
        ],
        fullArgs: [amountBigInt]
      });
      
      await writeContract({
        abi: poolAbi,
        address: lpAddress as `0x${string}`,
        functionName: "supplyLiquidity",
        args: [amountBigInt],
      });
      
      console.log("✅ Supply transaction submitted successfully");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Supply failed. Please try again.");
      console.error("❌ Supply transaction failed:", error.message, err);
      setError(error);
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

  console.log("🔐 useApproveToken hook state:", {
    tokenAddress,
    spenderAddress,
    hash,
    isPending,
    isLoading,
    isSuccess,
    isError,
    error: error?.message,
  });

  const approve = async (amount: string) => {
    console.log("🔓 Starting approval transaction:", { amount, tokenAddress, spenderAddress });
    setError(null);
    if (!tokenAddress || !spenderAddress) {
      const error = new Error("Missing token or spender address");
      console.error("❌ Approval error:", error.message, { tokenAddress, spenderAddress });
      setError(error);
      return;
    }

    if (!amount || isNaN(Number(amount))) {
      const error = new Error("Invalid approve amount");
      console.error("❌ Approval error:", error.message, { amount });
      setError(error);
      return;
    }

    const decimals = getTokenDecimals(tokenAddress);
    const amountBigInt = BigInt(Math.floor(Number(amount) * 10 ** decimals));
    
    console.log("💰 Approval calculation:", {
      originalAmount: amount,
      decimals,
      calculatedAmount: amountBigInt.toString(),
      multiplier: 10 ** decimals,
    });

    try {
      console.log("📝 Writing approval contract:", {
        abi: "mockErc20Abi",
        address: tokenAddress,
        functionName: "approve",
        args: [spenderAddress, amountBigInt.toString()],
      });
      
      console.log("🔧 Approval contract arguments:", {
        address: tokenAddress,
        functionName: "approve",
        args: [
          {
            value: spenderAddress,
            type: "address",
            description: "spender address"
          },
          {
            value: amountBigInt.toString(),
            type: "bigint",
            originalAmount: amount,
            decimals: decimals
          }
        ],
        fullArgs: [spenderAddress as `0x${string}`, amountBigInt]
      });
      
      await writeContract({
        abi: mockErc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, amountBigInt],
      });
      
      console.log("✅ Approval transaction submitted successfully");
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Approval failed. Please try again.");
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

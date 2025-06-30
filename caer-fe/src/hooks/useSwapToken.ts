"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { erc20Abi, parseUnits, Address } from "viem";
import { poolAbi } from "@/lib/abis/poolAbi";
import { toast } from "sonner";

interface SwapTokenParams {
  fromToken: {
    address: `0x${string}`;
    name: string;
    decimals: number;
  };
  toToken: {
    address: `0x${string}`;
    name: string;
    decimals: number;
  };
  fromAmount: string;
  toAmount: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  positionAddress: Address;
  lpAddress: Address;
}

export const useSwapToken = ({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  onSuccess,
  onError,
  positionAddress,
  lpAddress,
}: SwapTokenParams) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { writeContract } = useWriteContract();

  const swapToken = async () => {
    if (!address) {
      setError("Please connect your wallet");
      return;
    }

    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      // Calculate the amount with proper decimals
      const amountIn = parseUnits(fromAmount, fromToken.decimals);

      // Then perform the swap
      writeContract({
        address: lpAddress,
        abi: poolAbi,
        functionName: "swapTokenByPosition",
        args: [fromToken.address, toToken.address, BigInt(amountIn)],
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error during swap:", err);
      setError("Failed to execute swap. Please try again.");
      toast.error("Swap failed");

      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    swapToken,
    isLoading,
    error,
    setError,
  };
};

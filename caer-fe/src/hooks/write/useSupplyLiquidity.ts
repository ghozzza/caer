"use client";

import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";
import { chains } from "@/constants/chain-address";
import { tokens } from "@/constants/token-address";

const getTokenDecimals = (tokenAddress?: string): number => {
  if (!tokenAddress) return 6;
  const token = tokens.find((token) =>
    Object.values(token.addresses).some(
      (addr) => addr.toLowerCase() === tokenAddress.toLowerCase()
    )
  );
  return token?.decimals ?? 6;
};

const getLendingPoolAddress = (chainId: number): `0x${string}` | undefined => {
  const chain = chains.find((c) => c.id === chainId);
  return chain?.contracts.lendingPool as `0x${string}` | undefined;
};

export const useSupply = (chainId: number, borrowToken?: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "idle" | "approving" | "supplying"
  >("idle");

  const decimals = getTokenDecimals(borrowToken);
  const lendingPool = getLendingPoolAddress(chainId);

  const {
    data: approveHash,
    isPending: isApprovePending,
    writeContract: approveTransaction,
    reset: resetApprove,
  } = useWriteContract();

  const {
    data: supplyHash,
    isPending: isSupplyPending,
    writeContract: supplyTransaction,
    reset: resetSupply,
  } = useWriteContract();

  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } =
    useWaitForTransactionReceipt({
      hash: approveHash,
    });

  const { isLoading: isSupplyLoading, isSuccess: isSupplySuccess } =
    useWaitForTransactionReceipt({
      hash: supplyHash,
    });

  // Return the most relevant transaction hash based on current step
  const txHash =
    currentStep === "supplying" || supplyHash ? supplyHash : approveHash;

  const calculateBigIntAmount = (amount: string) => {
    return BigInt(Math.floor(Number(amount) * 10 ** decimals));
  };

  const supply = async (amount: string) => {
    setIsProcessing(true);
    setError(null);
    setCurrentStep("approving");

    if (!amount || isNaN(Number(amount))) {
      setError(new Error("Invalid supply amount"));
      setIsProcessing(false);
      setCurrentStep("idle");
      return;
    }

    if (!lendingPool || !borrowToken) {
      setError(new Error("Missing token or pool address"));
      setIsProcessing(false);
      setCurrentStep("idle");
      return;
    }

    const supplyAmountBigInt = calculateBigIntAmount(amount);

    try {
      console.log("⏳ Sending approval transaction...");

      // Step 1: Approve token
      await approveTransaction({
        abi: mockErc20Abi,
        address: borrowToken as `0x${string}`,
        functionName: "approve",
        args: [lendingPool, supplyAmountBigInt],
      });

      console.log("✅ Approval transaction sent!");

      // Wait for approval to complete before proceeding
      // This will be handled by the component watching isApproveSuccess
    } catch (err) {
      console.error("❌ Approval failed:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Approval failed. Please try again.")
      );
      setCurrentStep("idle");
      setIsProcessing(false);
    }
  };

  // Auto-proceed to supply step when approval is successful
  const proceedToSupply = async (amount: string) => {
    if (!isApproveSuccess || !lendingPool) return;

    setCurrentStep("supplying");
    const supplyAmountBigInt = calculateBigIntAmount(amount);

    try {
      console.log("⏳ Sending supply transaction...");

      await supplyTransaction({
        abi: poolAbi,
        address: lendingPool,
        functionName: "supplyLiquidity",
        args: [supplyAmountBigInt],
      });

      console.log("🚀 Supply transaction sent!");
    } catch (err) {
      console.error("❌ Supply failed:", err);
      setError(
        err instanceof Error
          ? err
          : new Error("Supply failed. Please try again.")
      );
      setCurrentStep("idle");
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setIsProcessing(false);
    setError(null);
    setCurrentStep("idle");
    resetApprove();
    resetSupply();
  };

  return {
    supply,
    proceedToSupply, // New function to handle the second step
    isApprovePending,
    isSupplyPending,
    isApproveLoading,
    isSupplyLoading,
    isProcessing,
    isSuccess: isSupplySuccess, // Only consider successful when supply is complete
    isApproveSuccess, // Expose approve success for step management
    error,
    txHash, // Current relevant transaction hash
    approveHash, // Specific approve transaction hash
    supplyHash, // Specific supply transaction hash
    currentStep, // Current step in the process
    reset,
  };
};

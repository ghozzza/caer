import { useState } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { poolAbi } from "@/lib/abi/poolAbi";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { lendingPool, mockUsdc } from "@/constants/addresses";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";

export const useSupply = (lpAddress?: string, borrowToken?: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decimals =
    TOKEN_OPTIONS.find((token) => token.address === borrowToken)?.decimals ?? 6;

  const {
    data: approveHash,
    isPending: isApprovePending,
    writeContract: approveTransaction,
  } = useWriteContract();

  const {
    data: supplyHash,
    isPending: isSupplyPending,
    writeContract: supplyTransaction,
  } = useWriteContract();

  const { isLoading: isApproveLoading } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isSupplyLoading, isSuccess } =
    useWaitForTransactionReceipt({
      hash: supplyHash,
    });

  const supply = async (amount: string) => {
    setIsProcessing(true);
    setError(null);

    if (!amount || isNaN(Number(amount))) {
      setError("Invalid supply amount");
      setIsProcessing(false);
      return;
    }

    const supplyAmountBigInt = BigInt(Number(amount) * 10 ** decimals);

    try {
      console.log("⏳ Sending approval transaction...");
      await approveTransaction({
        abi: mockErc20Abi,
        address: (borrowToken ?? mockUsdc) as `0x${string}`,
        functionName: "approve",
        args: [lendingPool, supplyAmountBigInt],
      });

      console.log("✅ Approval transaction sent!");
      await supplyTransaction({
        abi: poolAbi,
        address: lendingPool,
        functionName: "supplyLiquidity",
        args: [supplyAmountBigInt],
      });

      console.log("🚀 Supply transaction sent!");
    } catch (err) {
      console.error("❌ Transaction failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const dynamicSupply = async (amount: string) => {
    setIsProcessing(true);
    setError(null);

    if (!amount || isNaN(Number(amount))) {
      setError("Invalid supply amount");
      setIsProcessing(false);
      return;
    }
    const supplyAmountBigInt = BigInt(Number(amount) * 10 ** decimals);

    try {
      console.log("⏳ Sending approval transaction...");
      await approveTransaction({
        abi: mockErc20Abi,
        address: borrowToken as `0x${string}`,
        functionName: "approve",
        args: [lpAddress, supplyAmountBigInt],
      });

      console.log("✅ Approval transaction sent!");
      await supplyTransaction({
        abi: poolAbi,
        address: lpAddress as `0x${string}`,
        functionName: "supplyLiquidity",
        args: [supplyAmountBigInt],
      });
      console.log("🚀 Supply transaction sent!");
    } catch (err) {
      console.error("❌ Transaction failed:", err);
      setError("Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    supply,
    dynamicSupply,
    isApprovePending,
    isSupplyPending,
    isApproveLoading,
    isSupplyLoading,
    isProcessing,
    error,
    isSuccess,
  };
};

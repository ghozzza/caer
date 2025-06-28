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

export const useSupply = (chainId: number, borrowToken?: string, lpAddress?: string) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const decimals = getTokenDecimals(borrowToken);

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

  const calculateBigIntAmount = (amount: string) => {
    return BigInt(Math.floor(Number(amount) * 10 ** decimals));
  };

  const supply = async (amount: string) => {
    setIsProcessing(true);
    setError(null);

    if (!amount || isNaN(Number(amount))) {
      setError("Invalid supply amount");
      setIsProcessing(false);
      return;
    }

    if (!lpAddress || !borrowToken) {
      setError("Missing token or pool address");
      setIsProcessing(false);
      return;
    }

    const supplyAmountBigInt = calculateBigIntAmount(amount);

    try {
      console.log("⏳ Sending approval transaction...");
      await approveTransaction({
        abi: mockErc20Abi,
        address: borrowToken as `0x${string}`,
        functionName: "approve",
        args: [lpAddress as `0x${string}`, supplyAmountBigInt],
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
    isApprovePending,
    isSupplyPending,
    isApproveLoading,
    isSupplyLoading,
    isProcessing,
    error,
    isSuccess,
  };
};

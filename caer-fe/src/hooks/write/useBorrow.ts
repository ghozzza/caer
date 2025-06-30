import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { poolAbi } from "@/lib/abis/poolAbi";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { chains } from "@/constants/chain-address";

export function useBorrow(
  destinationChainId: number,
  amount: string,
  lpAddress: string,
  decimal: number
) {
  const { address } = useAccount();
  const fixedChainId = 43113;

  const {
    data: borrowHash,
    isPending: isBorrowPending,
    writeContract: borrowTransaction,
    error: borrowError,
  } = useWriteContract();

  const {
    isLoading: isBorrowLoading,
    isSuccess,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: borrowHash,
  });

  const handleBorrow = async () => {
    try {
      if (!amount || Number.parseFloat(amount) <= 0) {
        toast.error("Please enter a valid borrow amount");
        return;
      }

      const parsedAmount = parseUnits(amount, decimal);

      const destination = chains.find((c) => c.id === destinationChainId)?.destination;

      await borrowTransaction({
        address: lpAddress as `0x${string}`,
        abi: poolAbi,
        functionName: "borrowDebt",
        args: [parsedAmount, BigInt(fixedChainId), Number(destination)],
      });

    } catch (error: any) {
      toast.error(error?.message || "Borrow transaction failed");
    }
  };

  const isProcessing = isBorrowPending || isBorrowLoading;

  return {
    handleBorrow,
    isProcessing,
    borrowHash,
    isSuccess,
  };
}

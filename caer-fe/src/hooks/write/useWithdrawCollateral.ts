import { useCallback, useEffect, useState, useRef } from "react";
import type { Hash } from "viem";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { toast } from "sonner";

interface WithdrawArgs {
  amount: bigint;
  onBroadcast?: (txHash: Hash) => void;
}

export function useWithdrawCollateral(lpAddress?: string) {
  const [txHash, setTxHash] = useState<Hash | undefined>();
  const onBroadcastRef = useRef<((txHash: Hash) => void) | undefined>(undefined);

  const {
    writeContract,
    data: writeData,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract();

  const {
    data: receipt,
    isLoading: isReceiptLoading,
    isSuccess: isReceiptSuccess,
    isError: isReceiptError,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  // Tangkap txHash dari data write
  useEffect(() => {
    if (writeData) {
      const hash = writeData as Hash;
      setTxHash(hash);
      toast.info(
        `Transaction submitted. Hash: ${String(hash).slice(0, 10)}...`,
        { duration: 7000 }
      );
      
      // Call the onBroadcast callback if it exists
      if (onBroadcastRef.current) {
        onBroadcastRef.current(hash);
        onBroadcastRef.current = undefined; // Clear the callback
      }
    }
  }, [writeData]);

  // Tampilkan status sukses atau gagal
  useEffect(() => {
    if (isReceiptSuccess) {
      toast.success("Withdrawal confirmed on-chain ✅");
    }
    if (isReceiptError) {
      toast.error("Transaction reverted ❌");
    }
  }, [isReceiptSuccess, isReceiptError]);

  const withdraw = useCallback(
    ({ amount, onBroadcast }: WithdrawArgs) => {
      if (!lpAddress) {
        toast.error("Lending pool address unavailable on this network");
        return;
      }

      if (amount <= BigInt(0)) {
        toast.error("Amount must be greater than zero");
        return;
      }

      // Store the callback for later use
      onBroadcastRef.current = onBroadcast;

      try {
        writeContract({
          address: lpAddress as `0x${string}`,
          abi: poolAbi,
          functionName: "withdrawCollateral",
          args: [amount],
        });
      } catch (err) {
        console.error("Withdraw error:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to send withdraw transaction"
        );
        onBroadcastRef.current = undefined; // Clear the callback on error
      }
    },
    [lpAddress, writeContract]
  );

  const reset = () => {
    resetWrite();
    setTxHash(undefined);
    onBroadcastRef.current = undefined;
  };

  return {
    withdraw,
    reset,
    txHash,
    isWritePending,
    isReceiptLoading,
    isReceiptSuccess,
    isReceiptError,
    receipt,
    error: writeError ?? receiptError ?? undefined,
  };
}

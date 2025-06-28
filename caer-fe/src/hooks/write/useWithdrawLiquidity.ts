import { useCallback, useEffect, useState } from "react";
import type { Address, Hash } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { toast } from "sonner";

interface WithdrawArgs {
  amount: bigint;
  onBroadcast?: (txHash: Hash) => void;
}

export function useWithdrawLiquidity(lpAddress?: string) {

  const [txHash, setTxHash] = useState<Hash | undefined>();

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
      setTxHash(writeData as Hash); // ✅ cast jika perlu
      toast.info(
        `Transaction submitted. Hash: ${String(writeData).slice(0, 10)}...`,
        { duration: 7000 }
      );
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

      try {
        writeContract({
          address: lpAddress as `0x${string}`,
          abi: poolAbi,
          functionName: "withdrawLiquidity",
          args: [amount],
        });

        // txHash baru akan muncul lewat useEffect writeData
        // Callback jika dibutuhkan
        if (onBroadcast && writeData) {
          onBroadcast(writeData as Hash);
        }
      } catch (err) {
        console.error("Withdraw error:", err);
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to send withdraw transaction"
        );
      }
    },
    [lpAddress, writeContract, writeData]
  );

  const reset = () => {
    resetWrite();
    setTxHash(undefined);
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

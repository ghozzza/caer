import { useState, useCallback, useEffect } from "react";
import type { Address, Hash } from "viem";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { getLendingPoolAddress } from "@/lib/util/get-lending-pool";
import { toast } from "sonner";

interface WithdrawArgs {
  amount: bigint;
  onSuccess?: () => void;
}

export function useWithdrawLiquidity() {
  const { chain } = useAccount();
  const lendingPoolAddress = chain?.id
    ? getLendingPoolAddress(chain.id)
    : undefined;

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
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (writeData) setTxHash(writeData);
  }, [writeData]);

  useEffect(() => {
    if (isReceiptSuccess) toast.success("Withdrawal confirmed! ✅");
    if (isReceiptError) toast.error("Transaction reverted ❌");
  }, [isReceiptSuccess, isReceiptError]);

  const withdraw = useCallback(
    async ({ amount, onSuccess }: WithdrawArgs) => {
      if (!lendingPoolAddress) {
        toast.error("Lending pool address unavailable on this network");
        return;
      }
      if (amount <= BigInt(0)) {
        toast.error("Amount must be greater than zero");
        return;
      }

      try {
        await writeContract({
          address: lendingPoolAddress as Address,
          abi: poolAbi,
          functionName: "withdrawLiquidity",
          args: [amount],
        });

        toast.info("Transaction submitted; awaiting confirmation…");
        onSuccess?.();
      } catch (err) {
        console.error("Withdrawal error:", err);
        toast.error(
          err instanceof Error ? err.message : "Failed to send transaction"
        );
      }
    },
    [lendingPoolAddress, writeContract]
  );
  const reset = () => {
    resetWrite();
    setTxHash(undefined);
  };

  return {
    withdraw,
    reset,
    txHash,
    isPending: isWritePending,
    isLoading: isReceiptLoading,
    isSuccess: isReceiptSuccess,
    isError: isReceiptError,
    error: writeError ?? receiptError ?? undefined,
    receipt,
  };
}

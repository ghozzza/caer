import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { poolAbi } from "@/lib/abis/poolAbi";
import { chains } from "@/constants/chain-address";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";

export function useBorrow(
  _chainId: number, 
  destination: number,
  amount: string
) {
  const { address } = useAccount();
  const lendingPool = chains.find((c) => c.id === 43113)?.contracts.lendingPool;
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

  const [isOpen, setIsOpen] = useState(false);

  const handleBorrow = async () => {
    try {
      if (!amount || Number.parseFloat(amount) <= 0) {
        toast.error("Please enter a valid borrow amount");
        return;
      }
      const decimal = 6;
      const parsedAmount = parseUnits(amount, decimal);

      console.log("Borrow Transaction Data:");
      console.log("User Address:", address);
      console.log("Parsed Amount:", parsedAmount.toString());
      console.log("Chain ID:", fixedChainId); // selalu 43113
      console.log("Destination:", destination);

      await borrowTransaction({
        address: lendingPool as `0x${string}`,
        abi: poolAbi,
        functionName: "borrowDebt",
        args: [parsedAmount, BigInt(fixedChainId), destination],
      });

      toast.info("Transaction sent, waiting for confirmation...");
    } catch (error: any) {
      toast.error(error?.message || "Borrow transaction failed");
    }
  };

  useEffect(() => {
    if (isSuccess && borrowHash) {
      toast.success("Borrow successful. See transaction on explorer.");
      setIsOpen(false);
    }
  }, [isSuccess, borrowHash]);

  const isProcessing = isBorrowPending || isBorrowLoading;

  return {
    isOpen,
    setIsOpen,
    handleBorrow,
    isProcessing,
    borrowHash,
    isSuccess,
    borrowError,
  };
}

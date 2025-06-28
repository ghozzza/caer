"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { toast } from "sonner";
import { factoryAbi } from "@/lib/abis/factoryAbi";
import { createLPFactory } from "@/actions/CreateLPFactory";
import { getSelectedLPFactorybyColBor } from "@/actions/GetLPFactory";
import { chains } from "@/constants/chain-address";

export type HexAddress = `0x${string}`;

export const useCreatePool = (chainId: number, onSuccess: () => void) => {
  const { address } = useAccount();

  const [collateralToken, setCollateralToken] = useState<HexAddress | "">("");
  const [borrowToken, setBorrowToken] = useState<HexAddress | "">("");
  const [ltv, setLtv] = useState("");
  const [txHash, setTxHash] = useState<HexAddress | undefined>();
  const [isCreating, setIsCreating] = useState(false);

  const {
    writeContractAsync,
    isPending: isWritePending,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    isError,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const handleCreate = async () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    const chain = chains.find((c) => c.id === chainId);
    if (!chain) {
      toast.error("Unsupported chain");
      return;
    }

    if (chain.id !== 43113) {
      toast.error("Create pool is only supported on source chain (43113)");
      return;
    }

    if (!collateralToken || !borrowToken || !ltv) {
      toast.error("Please complete all fields");
      return;
    }

    const ltvFloat = parseFloat(ltv);
    if (isNaN(ltvFloat) || ltvFloat <= 0) {
      toast.error("LTV must be a valid number");
      return;
    }

    try {
      setIsCreating(true);
      setTxHash(undefined);

      const exists = await getSelectedLPFactorybyColBor(collateralToken, borrowToken);
      if (exists) {
        toast.error("Pool already exists");
        return;
      }

      const ltvBigInt = BigInt(Math.floor(ltvFloat * 1e16));

      const tx = await writeContractAsync({
        address: chain.contracts.factory as HexAddress,
        abi: factoryAbi,
        functionName: "createLendingPool",
        args: [collateralToken, borrowToken, ltvBigInt],
      });

      setTxHash(tx as HexAddress);
      toast.success("Transaction submitted. Waiting for confirmation...");
    } catch (err) {
      console.error("Tx submit error:", err);
      toast.error("Transaction failed to submit");
      setIsCreating(false);
    }
  };

  // After tx confirmed ➜ save pool to DB
  useEffect(() => {
    const persist = async () => {
      if (isSuccess && txHash && address) {
        const res = await createLPFactory(
          address,
          collateralToken,
          borrowToken,
          ltv,
          chainId
        );

        if (res.success) {
          toast.success("Pool created and saved");
          onSuccess();
        } else {
          toast.warning(res.message);
        }

        // reset form
        setCollateralToken("");
        setBorrowToken("");
        setLtv("");
        setIsCreating(false);
      }
    };

    persist();
  }, [isSuccess]);

  // Handle receipt error
  useEffect(() => {
    if (isError) {
      const msg = confirmError?.message || writeError?.message || "Transaction failed";
      toast.error(`Transaction failed: ${msg}`);
      setIsCreating(false);
    }
  }, [isError, confirmError, writeError]);

  return {
    collateralToken,
    borrowToken,
    ltv,
    setCollateralToken,
    setBorrowToken,
    setLtv,
    handleCreate,
    isCreating: isCreating || isWritePending,
    isConfirming,
    txHash,
  };
};
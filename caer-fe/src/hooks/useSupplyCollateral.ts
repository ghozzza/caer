import { useState, useEffect } from "react";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { mockErc20Abi } from "@/lib/abi/mockErc20Abi";
import { poolAbi } from "@/lib/abi/poolAbi";
import { lendingPool, mockWeth } from "@/constants/addresses";
import { toast } from "sonner";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";

export function useSupplyCollateral(
  lpAddress?: string,
  collateralToken?: string
) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

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
    useWaitForTransactionReceipt({ hash: supplyHash });

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      setIsBlurred(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isOpen) {
      setIsBlurred(true);
    } else {
      setTimeout(() => setIsBlurred(false), 300);
    }
  }, [isOpen]);

  const handleSupply = async () => {
    try {
      if (!amount || Number.parseFloat(amount) <= 0) {
        alert("Please enter a valid amount to supply");
        return;
      }

      const parsedAmount = parseUnits(amount.toString(), 18);

      await approveTransaction({
        abi: mockErc20Abi,
        address: mockWeth,
        functionName: "approve",
        args: [lendingPool, parsedAmount],
      });

      await supplyTransaction({
        address: lendingPool,
        abi: poolAbi,
        functionName: "supplyCollateralByPosition",
        args: [parsedAmount],
      });
      setAmount("");
    } catch (error) {
      alert("Supply error:");
    }
  };

  const dynamicHandleSupply = async () => {
    try {
      if (!amount || Number.parseFloat(amount) <= 0) {
        alert("Please enter a valid amount to supply");
        return;
      }
      const decimals = TOKEN_OPTIONS.find(
        (token) => token.address === collateralToken
      )?.decimals;
      const parsedAmount = parseUnits(amount.toString(), decimals ?? 18);

      approveTransaction({
        abi: mockErc20Abi,
        address: collateralToken as `0x${string}`,
        functionName: "approve",
        args: [lpAddress, parsedAmount],
      });

      supplyTransaction({
        address: lpAddress as `0x${string}`,
        abi: poolAbi,
        functionName: "supplyCollateralByPosition",
        args: [parsedAmount],
      });
      setAmount("");
    } catch (error) {
      toast.error(`Supply error: ${error}`);
    }
  };

  const isProcessing =
    isApprovePending || isSupplyPending || isApproveLoading || isSupplyLoading;

  return {
    amount,
    setAmount,
    isOpen,
    setIsOpen,
    isBlurred,
    handleSupply,
    dynamicHandleSupply,
    isProcessing,
    isSuccess,
  };
}

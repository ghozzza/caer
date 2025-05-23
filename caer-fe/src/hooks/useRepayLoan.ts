import { useState } from "react";
import { useWriteContract, useReadContract, useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useBorrowBalance } from "./useBorrowBalance";
import { poolAbi } from "@/lib/abi/poolAbi";
import { lendingPool, mockUsdc, priceFeed } from "@/constants/addresses";
import { priceAbi } from "@/lib/abi/price-abi";
import { useReadLendingData } from "./read/useReadLendingData";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";

interface UseRepayLoanProps {
  tokenAddress: `0x${string}`;
  arrayLocation: bigint;
  lpAddress: `0x${string}`;
}

export const useRepayLoan = ({ tokenAddress, arrayLocation, lpAddress }: UseRepayLoanProps) => {
  const [valueAmount, setValueAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const borrowBalance = useBorrowBalance();
  const { writeContract, isPending, data: hash } = useWriteContract();
  const { address } = useAccount();
  const { totalBorrowAssets, totalBorrowShares, refetchAll } = useReadLendingData(
    address,
    tokenAddress,
    lpAddress
  );

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Fetch Real-time Price
  const { data: realPrice } = useReadContract({
    address: priceFeed,
    abi: priceAbi,
    functionName: "getPrice",
    args: [tokenAddress, mockUsdc],
  });

  // Calculate Debt Equivalent in USDC
  const debtEquals = () => {
    if (
      !totalBorrowAssets ||
      !totalBorrowShares ||
      !borrowBalance ||
      Number(totalBorrowShares) === 0
    ) {
      return 0;
    }
    return Number(
      (Number(borrowBalance) * Number(totalBorrowAssets)) /
        Number(totalBorrowShares)
    );
  };

  const handleApproveAndRepay = async () => {
    if (!valueAmount || Number(valueAmount) <= 0) {
      alert("Please enter a valid amount to repay");
      return;
    }

    console.log("valueAmount", valueAmount)
    console.log("arrayLocation", arrayLocation)
    console.log("tokenAddress", tokenAddress)

    const amount = BigInt(Math.round(Number(valueAmount) * 1e6)); // Convert to USDC precision
    const approvalAmount = amount + amount; // Approving twice to ensure full coverage

    console.log("amount", amount)
    console.log("approvalAmount", approvalAmount)

    try {
      writeContract({
        address: lendingPool,
        abi: poolAbi,
        functionName: "repayWithSelectedToken",
        args: [amount, 0, tokenAddress],
      });

      setValueAmount("");
      setIsOpen(false);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Check the console for more details.");
    }
  };

  const dynamicHandleApproveAndRepay = async () => {
    if (!valueAmount || Number(valueAmount) <= 0) {
      alert("Please enter a valid amount to repay");
      return;
    }

    console.log("valueAmount", valueAmount)
    console.log("arrayLocation", arrayLocation)
    console.log("tokenAddress", tokenAddress)

    const tokenDecimals =  TOKEN_OPTIONS.find(token => token.address === tokenAddress)?.decimals ?? 6;

    const amount = BigInt(Math.round(Number(valueAmount) * 10 ** tokenDecimals));
    const approvalAmount = amount + amount; // Approving twice to ensure full coverage

    console.log("amount", amount)
    console.log("approvalAmount", approvalAmount)

    try {
      writeContract({
        address: lpAddress,
        abi: poolAbi,
        functionName: "repayWithSelectedToken",
        args: [amount, 0, tokenAddress],
      });

      setValueAmount("");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Check the console for more details.");
    }
  };

  // Handle transaction success
  if (isSuccess) {
    setIsOpen(false);
    refetchAll();
  }

  return {
    valueAmount,
    setValueAmount,
    isOpen,
    setIsOpen,
    realPrice: realPrice ? Number(realPrice) / 1e6 : 1,
    debtEquals,
    handleApproveAndRepay,
    dynamicHandleApproveAndRepay,
    isPending: isPending || isConfirming,
  };
};

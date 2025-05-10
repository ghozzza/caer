import { ArrowUpRight, Loader2, Wallet } from "lucide-react";
import { AmountInput } from "@/components/dialog/withdraw-collateral-dialog";
import React, { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { poolAbi } from "@/lib/abi/poolAbi";
import { useWriteContract } from "wagmi";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";

interface SupplyCollateralSectionProps {
  collateralToken: string;
  lpAddress: string;
  onSuccess?: () => void;
}

const WithdrawCollateralSection = ({
  collateralToken,
  lpAddress,
  onSuccess,
}: SupplyCollateralSectionProps) => {
  const [wethAmount, setWethAmount] = useState("0");
  const { dynamicUserCollateral, refetchAll } = useReadLendingData(
    undefined,
    undefined,
    lpAddress as `0x${string}`
  );
  const { writeContract, isPending } = useWriteContract();
  const tokenAddress = TOKEN_OPTIONS.find(
    (token) => token.name === collateralToken
  )?.address;

  const tokenDecimals = TOKEN_OPTIONS.find(
    (token) => token.address === tokenAddress
  )?.decimals;
  const collateralBalance = (amount: number) => {
    return Number(dynamicUserCollateral) / 10 ** Number(tokenDecimals);
  };

  const handleWithdraw = async () => {
    if (!wethAmount || Number.parseFloat(wethAmount) <= 0) {
      toast.error("Please enter a valid amount to withdraw");
      return;
    }

    if (Number.parseFloat(wethAmount) > Number(dynamicUserCollateral)) {
      toast.error("Amount exceeds available collateral balance");
      return;
    }

    try {
      // Convert to wei using BigInt to avoid floating point precision issues
      const amount = BigInt(
        Math.floor(Number(wethAmount) * 10 ** Number(tokenDecimals))
      );

      writeContract({
        address: lpAddress as `0x${string}`,
        abi: poolAbi,
        functionName: "withdrawCollateral",
        args: [amount],
      });

      toast.success("Withdrawal in progress...");
      setWethAmount("0");
      // Refetch data after successful withdrawal
      await refetchAll();
      onSuccess?.();
    } catch (error) {
      console.error("Withdrawal error:", error);
      if (error instanceof Error) {
        toast.error(`Withdrawal failed: ${error.message}`);
      } else {
        toast.error("Withdrawal failed. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="space-y-6 py-4">
        <AmountInput
          value={wethAmount ?? ""}
          onChange={setWethAmount}
          token={collateralToken}
          label="Withdraw Amount"
          collateralBalance={collateralBalance(Number(dynamicUserCollateral))}
        />

        <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
          <div className="flex items-start">
            <div className="bg-purple-100 p-1 rounded-full mr-2">
              <Wallet className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-purple-700 mb-1">
                Withdrawal Information
              </h4>
              <p className="text-xs text-purple-600">
                Withdrawing collateral may affect your borrowing capacity.
                Ensure you maintain a healthy position to avoid liquidation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          onClick={handleWithdraw}
          disabled={
            isPending ||
            !wethAmount ||
            Number.parseFloat(wethAmount) <= 0 ||
            Number(dynamicUserCollateral) == 0
          }
          className={`w-full h-12 text-base font-medium rounded-lg ${
            isPending
              ? "bg-slate-200 text-slate-500"
              : "bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
          }`}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ArrowUpRight className="mr-2 h-5 w-5" />
          )}
          Withdraw {collateralToken}
        </Button>
      </DialogFooter>
    </>
  );
};

export default WithdrawCollateralSection;

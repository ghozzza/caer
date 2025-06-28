"use client";

import { ArrowUpRight, Loader2, Wallet, X } from "lucide-react";
import { AmountInput } from "@/components/dialog/withdraw-collateral-dialog";
import { useState, useMemo } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatUnits } from "viem";
import { useReadUserCollateral } from "@/hooks/read/useReadUserCollateral";
import { useWithdrawCollateral } from "@/hooks/write/useWithdrawCollateral";

interface WithdrawCollateralSectionProps {
  collateralToken: string;
  lpAddress?: string;
  onSuccess?: () => void;
}

const WithdrawCollateralSection = ({
  collateralToken,
  onSuccess,
}: WithdrawCollateralSectionProps) => {
  const [amountInput, setAmountInput] = useState("0");
  const [showSuccessState, setShowSuccessState] = useState(false);

  const {
    userCollateral,
    positionLoading,
    collateralLoading,
    positionError,
    collateralError,
    wethToken,
  } = useReadUserCollateral();

  const { withdraw, isPending, isLoading, isSuccess, txHash } =
    useWithdrawCollateral();

  const formattedBalance = useMemo(() => {
    return userCollateral && wethToken
      ? formatUnits(userCollateral, wethToken.decimals)
      : null;
  }, [userCollateral, wethToken]);

  const collateralBalanceNumber = useMemo(() => {
    const num = Number(formattedBalance);
    return isNaN(num) ? 0 : num;
  }, [formattedBalance]);

  const isDataLoading = positionLoading || collateralLoading;
  const hasDataError = positionError || collateralError;

  const isWithdrawDisabled =
    isPending ||
    isLoading ||
    isDataLoading ||
    !!hasDataError ||
    Number.parseFloat(amountInput) <= 0 ||
    Number.parseFloat(amountInput) > collateralBalanceNumber;

  const handleWithdraw = async () => {
    const parsed = Number.parseFloat(amountInput);

    if (parsed <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    if (parsed > collateralBalanceNumber) {
      toast.error("Amount exceeds available collateral");
      return;
    }

    const amount = BigInt(
      Math.floor(parsed * 10 ** (wethToken?.decimals ?? 18))
    );

    await withdraw({
      amount,
      onSuccess: () => {
        setAmountInput("0");
        setShowSuccessState(true);
      },
    });
  };

  const handleClose = () => {
    onSuccess?.();
  };

  const handleNewWithdrawal = () => {
    setShowSuccessState(false);
    setAmountInput("0");
  };

  // Show success state after successful withdrawal
  if (showSuccessState && isSuccess) {
    return (
      <>
        <div className="space-y-6 py-4">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Withdrawal Successful!
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Your {collateralToken} withdrawal has been confirmed on-chain.
            </p>
            {txHash && (
              <div className="bg-white p-3 rounded border border-green-200">
                <p className="text-xs text-green-600 mb-1">Transaction Hash:</p>
                <a
                  href={`https://testnet.snowtrace.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {txHash}
                </a>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            onClick={handleNewWithdrawal}
            variant="outline"
            className="flex-1 h-12 text-base font-medium rounded-lg bg-transparent"
          >
            Make Another Withdrawal
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 h-12 text-base font-medium rounded-lg bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white shadow-md hover:shadow-lg transition-colors duration-300"
          >
            <X className="mr-2 h-5 w-5" />
            Close
          </Button>
        </DialogFooter>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6 py-4">
        <AmountInput
          value={amountInput}
          onChange={setAmountInput}
          token={collateralToken}
          label="Withdraw Amount"
          collateralBalance={collateralBalanceNumber}
          disabled={isPending || isLoading || isDataLoading}
        />

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-start">
            <div className="bg-purple-100 p-1 rounded-full mr-3 shrink-0">
              <Wallet className="h-4 w-4 text-purple-600" />
            </div>
            <div className="w-full">
              <h4 className="text-sm font-medium text-purple-700 mb-3">
                Withdrawal Information
              </h4>
              {!isDataLoading && !hasDataError && (
                <div className="pt-2 border-t border-purple-200">
                  <p className="text-xs text-purple-600">
                    ⚠️ Withdrawing collateral may reduce your borrowing
                    capacity. Make sure your position stays healthy to avoid
                    liquidation.
                  </p>
                  {txHash && !showSuccessState && (
                    <p className="text-xs mt-2">
                      Tx&nbsp;Hash:&nbsp;
                      <a
                        href={`https://testnet.snowtrace.io/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {txHash.slice(0, 10)}…
                      </a>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button
          onClick={handleWithdraw}
          disabled={isWithdrawDisabled}
          className={`w-full h-12 text-base font-medium rounded-lg ${
            isPending || isLoading || isDataLoading
              ? "bg-slate-200 text-slate-500"
              : "bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white shadow-md hover:shadow-lg transition-colors duration-300"
          }`}
        >
          {isPending || isLoading || isDataLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {isPending
                ? "Pending in wallet..."
                : isLoading
                ? "Waiting for confirmation..."
                : "Loading..."}
            </>
          ) : (
            <>
              <ArrowUpRight className="mr-2 h-5 w-5" />
              Withdraw&nbsp;{collateralToken}
            </>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default WithdrawCollateralSection;

"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  ArrowDown,
  CreditCard,
  DollarSign,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { tokens } from "@/constants/token-address";
import { useReadUserBorrowShares } from "@/hooks/read/useReadUserBorrowShares";
import { useReadTotalBorrowAssets } from "@/hooks/read/useReadTotalBorrowAssets";
import { useReadTotalBorrowShares } from "@/hooks/read/useReadTotalBorrowShares";
import { useApproveToken, useRepay } from "@/hooks/write/useRepayLoan";

const AmountInput = ({
  value,
  onChange,
  token,
  label,
  userBorrowShares,
  totalBorrowAssets,
  totalBorrowShares,
  tokenDecimal,
  disabled = false,
}: any) => {
  const userDebt =
    (Number(userBorrowShares) * Number(totalBorrowAssets)) /
    Number(totalBorrowShares || 1);
  const debtAmount = Number(userDebt) / 10 ** Number(tokenDecimal || 6);

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-slate-700">{label}</h3>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Repay
          </Badge>
        </div>

        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
          />
          <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
            <DollarSign className="h-4 w-4 text-slate-700" />
            <span className="font-semibold text-slate-700">{token}</span>
          </div>
        </div>

        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between">
          <span className="text-sm text-blue-700">Debt :</span>
          <div className="flex items-center text-xs gap-2">
            <span>
              {debtAmount.toFixed(5)} ${token}
            </span>
            <button
              className="text-xs px-2 py-0.5 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onChange(debtAmount.toString())}
              disabled={disabled}
            >
              Max
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const RepaySection = ({
  lpAddress,
  borrowToken,
  onSuccess,
}: {
  lpAddress: string;
  borrowToken: string;
  onSuccess: () => void;
}) => {
  const tokenData = tokens.find((t) => t.name === borrowToken);
  const tokenDecimal = tokenData?.decimals;

  const [amount, setAmount] = useState("");
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [inputError, setInputError] = useState("");
  const [currentStep, setCurrentStep] = useState<
    "idle" | "approving" | "repaying" | "success"
  >("idle");

  const {
    userBorrowShares,
    isLoadingUserBorrowShares,
    refetchUserBorrowShares,
  } = useReadUserBorrowShares(lpAddress as `0x${string}`);

  const {
    totalBorrowAssets,
    isLoadingTotalBorrowAssets,
    refetchTotalBorrowAssets,
  } = useReadTotalBorrowAssets(lpAddress as `0x${string}`);

  const {
    totalBorrowShares,
    isLoadingTotalBorrowShares,
    refetchTotalBorrowShares,
  } = useReadTotalBorrowShares(lpAddress as `0x${string}`);

  const {
    approve,
    hash: approveHash,
    isPending: isApprovePending,
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    isError: isApproveError,
    error: approveError,
    reset: resetApprove,
  } = useApproveToken(borrowToken, lpAddress);

  const {
    repay,
    hash: repayHash,
    isPending: isRepayPending,
    isLoading: isRepayLoading,
    isSuccess: isRepaySuccess,
    isError: isRepayError,
    error: repayError,
    reset: resetRepay,
  } = useRepay(borrowToken, lpAddress, true);

  // Update current step based on hook states
  useEffect(() => {
    if (isApprovePending || isApproveLoading) {
      setCurrentStep("approving");
    } else if (isRepayPending || isRepayLoading) {
      setCurrentStep("repaying");
    } else if (isRepaySuccess) {
      setCurrentStep("success");
    } else {
      setCurrentStep("idle");
    }
  }, [
    isApprovePending,
    isApproveLoading,
    isRepayPending,
    isRepayLoading,
    isRepaySuccess,
  ]);

  // Handle repay success
  useEffect(() => {
    if (isRepaySuccess) {
      setShowSuccessState(true);
      // Trigger refetch after success
      setTimeout(() => {
        refetchUserBorrowShares();
        refetchTotalBorrowAssets();
        refetchTotalBorrowShares();
      }, 2000);
    }
  }, [
    isRepaySuccess,
    refetchUserBorrowShares,
    refetchTotalBorrowAssets,
    refetchTotalBorrowShares,
  ]);

  const validateAmount = (value: string): string => {
    if (!value || value === "0") return "Amount is required";
    const numValue = Number.parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return "Invalid amount";

    // Check if amount exceeds debt
    const userDebt =
      (Number(userBorrowShares) * Number(totalBorrowAssets)) /
      Number(totalBorrowShares);
    const debtAmount = Number(userDebt) / 10 ** Number(tokenDecimal || 6);
    if (numValue > debtAmount) return "Amount exceeds debt";

    return "";
  };

  const handleAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setInputError(validateAmount(value));
    }
  };

  const handleApprove = () => {
    const error = validateAmount(amount);
    if (error) {
      setInputError(error);
      return;
    }
    approve(amount);
  };

  const handleRepay = () => {
    const error = validateAmount(amount);
    if (error) {
      setInputError(error);
      return;
    }
    repay(amount, totalBorrowAssets?.toString(), totalBorrowShares?.toString());
  };

  const handleClose = () => {
    onSuccess?.();
  };

  const handleNewRepay = () => {
    setShowSuccessState(false);
    setAmount("");
    setInputError("");
    setCurrentStep("idle");
    resetApprove();
    resetRepay();
  };

  const getProgressValue = () => {
    switch (currentStep) {
      case "approving":
        return 25;
      case "repaying":
        return 75;
      case "success":
        return 100;
      default:
        return 0;
    }
  };

  const getStepText = () => {
    switch (currentStep) {
      case "approving":
        return "Approving token spend...";
      case "repaying":
        return "Processing repayment...";
      case "success":
        return "Transaction completed!";
      default:
        return "Ready to repay";
    }
  };

  const getButtonText = () => {
    if (
      isApprovePending ||
      isRepayPending ||
      isApproveLoading ||
      isRepayLoading
    ) {
      return "Processing Transaction...";
    }

    if (isApproveSuccess && !isRepaySuccess) {
      return `Repay ${borrowToken}`;
    }

    return `Approve ${borrowToken}`;
  };

  const getStepBadge = () => {
    if (currentStep === "approving") {
      return "Step 1/2: Approving";
    }
    if (currentStep === "repaying") {
      return "Step 2/2: Repaying";
    }
    if (isApproveSuccess && !isRepaySuccess) {
      return "Step 1/2: Approved ✓";
    }
    return null;
  };

  const equalsToToken = () => {
    const shares = Number(userBorrowShares || 0);
    const assets = Number(totalBorrowAssets || 0);
    const total = Number(totalBorrowShares || 1);
    const raw = (shares * assets) / total;
    return (raw / 10 ** Number(tokenDecimal || 6)).toFixed(5);
  };

  // Success State
  if (showSuccessState && isRepaySuccess) {
    return (
      <>
        <div className="space-y-6 py-4">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Repayment Successful!
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Your {borrowToken} debt has been successfully repaid.
            </p>

            {/* Transaction Hashes */}
            <div className="space-y-3">
              {approveHash && (
                <div className="bg-white p-3 rounded border border-green-200">
                  <p className="text-xs text-green-600 mb-1">
                    Approval Transaction:
                  </p>
                  <a
                    href={`https://testnet.snowtrace.io/tx/${approveHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all flex items-center justify-center gap-1"
                  >
                    {approveHash}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {repayHash && (
                <div className="bg-white p-3 rounded border border-green-200">
                  <p className="text-xs text-green-600 mb-1">
                    Repayment Transaction:
                  </p>
                  <a
                    href={`https://testnet.snowtrace.io/tx/${repayHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all flex items-center justify-center gap-1"
                  >
                    {repayHash}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            onClick={handleNewRepay}
            variant="outline"
            className="flex-1 h-12 text-base font-medium rounded-lg bg-transparent"
          >
            Repay More
          </Button>
          <Button
            onClick={handleClose}
            className="flex-1 h-12 text-base font-medium rounded-lg bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white shadow-md hover:shadow-lg transition-colors duration-300"
          >
            Close
          </Button>
        </DialogFooter>
      </>
    );
  }

  // Input State
  return (
    <>
      <div className="space-y-6 py-4">
        <AmountInput
          value={amount}
          onChange={handleAmountChange}
          token={borrowToken}
          label="Repay Amount"
          userBorrowShares={userBorrowShares}
          totalBorrowAssets={totalBorrowAssets}
          totalBorrowShares={totalBorrowShares}
          tokenDecimal={tokenDecimal}
          disabled={
            isApprovePending ||
            isRepayPending ||
            isApproveLoading ||
            isRepayLoading
          }
        />

        {inputError && (
          <div className="flex items-center gap-1 text-sm text-red-500">
            <AlertCircle className="h-3 w-3" />
            {inputError}
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <div className="bg-blue-100 p-1 rounded-full mr-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-medium text-blue-700 mb-1">
                Repayment Information
              </h4>
              <p className="text-xs text-blue-600">
                Debt: {equalsToToken()} {borrowToken}
              </p>
            </div>
          </div>
        </div>

        {/* Approval Success Message */}
        {isApproveSuccess && !isRepaySuccess && (
          <Card className="border border-green-200 bg-green-50 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Token approval successful! You can now repay your{" "}
                  {borrowToken} debt.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {(approveError || repayError) && (
          <Card className="border border-red-200 bg-red-50 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {(approveError || repayError)?.message ||
                    "Transaction failed"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Progress */}
        {(isApprovePending ||
          isRepayPending ||
          isApproveLoading ||
          isRepayLoading) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Transaction Progress</span>
              <span className="text-slate-500">{getStepText()}</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>
        )}

        {/* Transaction Hash */}
        {(approveHash || repayHash) && !isRepaySuccess && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isRepaySuccess ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-xs text-gray-600">
                {currentStep === "approving" ? "Approval" : "Repayment"}{" "}
                Transaction
              </span>
            </div>
            <a
              href={`https://testnet.snowtrace.io/tx/${approveHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all flex items-center gap-1"
            >
              {approveHash?.slice(0, 20)}
              ...
              {approveHash?.slice(-10)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      <DialogFooter className="flex gap-3">
        {!isApproveSuccess ? (
          // Show only Approve button before approval
          <Button
            onClick={handleApprove}
            disabled={
              !amount ||
              Number(amount) <= 0 ||
              isApprovePending ||
              isApproveLoading ||
              !!inputError
            }
            className={`w-full h-12 text-base font-medium rounded-lg duration-300 transition-colors ${
              !amount ||
              Number(amount) <= 0 ||
              isApprovePending ||
              isApproveLoading ||
              !!inputError
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg"
            }`}
          >
            {isApprovePending || isApproveLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>
                  {isApprovePending
                    ? "Confirm Approval..."
                    : "Approving Token..."}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ArrowDown className="mr-2 h-5 w-5" />
                <span>Approve {borrowToken}</span>
              </div>
            )}
          </Button>
        ) : (
          // Show Repay button after approval
          <Button
            onClick={handleRepay}
            disabled={
              !amount ||
              Number(amount) <= 0 ||
              isRepayPending ||
              isRepayLoading ||
              !!inputError
            }
            className={`w-full h-12 text-base font-medium rounded-lg duration-300 transition-colors ${
              !amount ||
              Number(amount) <= 0 ||
              isRepayPending ||
              isRepayLoading ||
              !!inputError
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white font-medium shadow-md hover:shadow-lg cursor-pointer"
            }`}
          >
            {isRepayPending || isRepayLoading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>
                  {isRepayPending
                    ? "Confirm Repay..."
                    : "Processing Repayment..."}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <ArrowDown className="mr-2 h-5 w-5" />
                <span>Repay {borrowToken}</span>
              </div>
            )}
          </Button>
        )}
      </DialogFooter>
    </>
  );
};

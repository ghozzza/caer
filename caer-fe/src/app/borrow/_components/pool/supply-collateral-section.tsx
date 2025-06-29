"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Loader2,
  Shield,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useBalance } from "@/hooks/useBalance";
import { useSupplyCollateral, useApproveCollateral } from "@/hooks/write/useSupplyCollateral";
import { tokens } from "@/constants/token-address";
import { createPosition } from "@/actions/CreatePosition";
import { useAccount } from "wagmi";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from 'lucide-react';
import { toast } from "sonner";

interface SupplyCollateralSectionProps {
  collateralToken: string;
  borrowToken: string;
  lpAddress: string;
  onSuccess?: () => void;
}

const CHAIN_ID = 43113;

const SupplyCollateralSection = ({
  collateralToken,
  borrowToken,
  lpAddress,
  onSuccess,
}: SupplyCollateralSectionProps) => {
  const [amount, setAmount] = useState("");
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [balanceRefreshKey, setBalanceRefreshKey] = useState(0);
  const [inputError, setInputError] = useState("");
  const [currentStep, setCurrentStep] = useState<"idle" | "approving" | "supplying" | "success">("idle");

  const tokenInfo = tokens.find(
    (token) => token.name === collateralToken && token.addresses[CHAIN_ID]
  );
  const tokenAddress = tokenInfo?.addresses[CHAIN_ID] as `0x${string}`;
  const tokenDecimals = tokenInfo?.decimals ?? 18;

  const { address } = useAccount();

  // Approval hook
  const {
    approve,
    hash: approveHash,
    isPending: isApprovePending,
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    error: approveError,
    reset: resetApprove,
  } = useApproveCollateral(tokenAddress, lpAddress);

  // Supply hook
  const {
    supply,
    hash: supplyHash,
    isPending: isSupplyPending,
    isLoading: isSupplyLoading,
    isSuccess: isSupplySuccess,
    error: supplyError,
    reset: resetSupply,
  } = useSupplyCollateral(tokenAddress, lpAddress);

  const tokenBalance = useBalance(tokenAddress, tokenDecimals);
  const maxBalance = Number.parseFloat(tokenBalance.balance) || 0;

  const isTransactionPending = isApprovePending || isSupplyPending || isApproveLoading || isSupplyLoading;

  // Update current step based on hook states
  useEffect(() => {
    if (isApprovePending || isApproveLoading) {
      setCurrentStep("approving");
    } else if (isSupplyPending || isSupplyLoading) {
      setCurrentStep("supplying");
    } else if (isApproveSuccess || isSupplySuccess) {
      // Keep current step until reset
    } else {
      setCurrentStep("idle");
    }
  }, [
    isApprovePending,
    isApproveLoading,
    isSupplyPending,
    isSupplyLoading,
    isApproveSuccess,
    isSupplySuccess,
  ]);

  const validateAmount = (value: string): string => {
    if (!value || value === "0") return "Amount is required";
    const numValue = Number.parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return "Invalid amount";
    if (numValue > maxBalance) return "Insufficient balance";
    return "";
  };

  const handleAmountChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setInputError(validateAmount(value));
    }
  };

  const handleMaxClick = () => {
    const maxAmount = String(maxBalance);
    setAmount(maxAmount);
    setInputError(validateAmount(maxAmount));
  };

  const handleAction = () => {
    const error = validateAmount(amount);
    if (error) {
      setInputError(error);
      toast.error(error);
      return;
    }

    // If approval is successful, proceed to supply
    if (isApproveSuccess && currentStep !== "supplying") {
      supply(amount);
    } else {
      // Otherwise, start with approval
      approve(amount);
    }
  };

  const handleRefetch = async () => {
    setIsRefetching(true);
    // Simulate refetch delay and trigger balance refresh
    setTimeout(() => {
      setBalanceRefreshKey((prev) => prev + 1);
      setIsRefetching(false);
    }, 1000);
  };

  const handleClose = () => {
    onSuccess?.();
  };

  const handleNewSupply = () => {
    setShowSuccessState(false);
    setAmount("");
    setInputError("");
    setCurrentStep("idle");
    resetApprove();
    resetSupply();
  };

  const getProgressValue = () => {
    switch (currentStep) {
      case "approving":
        return 25;
      case "supplying":
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
      case "supplying":
        return "Supplying collateral...";
      case "success":
        return "Transaction completed!";
      default:
        return "Ready to supply";
    }
  };

  const getButtonText = () => {
    if (isTransactionPending) {
      if (currentStep === "approving") {
        return isApprovePending ? "Confirm Approval..." : "Approving Token...";
      }
      if (currentStep === "supplying") {
        return isSupplyPending ? "Confirm Supply..." : "Supplying Collateral...";
      }
      return "Processing Transaction...";
    }

    if (isApproveSuccess && !isSupplySuccess) {
      return `Supply ${collateralToken} as Collateral`;
    }

    return `Approve ${collateralToken}`;
  };

  const getStepBadge = () => {
    if (currentStep === "approving") {
      return "Step 1/2: Approving";
    }
    if (currentStep === "supplying") {
      return "Step 2/2: Supplying";
    }
    if (isApproveSuccess && !isSupplySuccess) {
      return "Step 1/2: Approved ✓";
    }
    return null;
  };

  useEffect(() => {
    if (isSupplySuccess && tokenAddress) {
      createPosition(
        collateralToken,
        borrowToken,
        "0",
        lpAddress,
        address as `0x${string}`
      );
      setShowSuccessState(true);
      // Trigger balance refresh after success
      setTimeout(() => {
        handleRefetch();
      }, 2000);
    }
  }, [
    isSupplySuccess,
    tokenAddress,
    collateralToken,
    borrowToken,
    lpAddress,
    address,
  ]);

  if (!tokenInfo) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Token {collateralToken} is not supported on chain {CHAIN_ID}
        </AlertDescription>
      </Alert>
    );
  }

  // Success State
  if (showSuccessState && isSupplySuccess) {
    return (
      <>
        <div className="space-y-6 py-4">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Supply Successful!
            </h3>
            <p className="text-sm text-green-700 mb-4">
              Your {collateralToken} has been successfully supplied as
              collateral.
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

              {supplyHash && (
                <div className="bg-white p-3 rounded border border-green-200">
                  <p className="text-xs text-green-600 mb-1">
                    Supply Transaction:
                  </p>
                  <a
                    href={`https://testnet.snowtrace.io/tx/${supplyHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all flex items-center justify-center gap-1"
                  >
                    {supplyHash}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3">
          <Button
            onClick={handleNewSupply}
            variant="outline"
            className="flex-1 h-12 text-base font-medium rounded-lg bg-transparent"
          >
            Supply More Collateral
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
        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-slate-700">
                Supply Amount
              </h3>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200"
                >
                  Collateral
                </Badge>
                {getStepBadge() && (
                  <Badge variant="secondary" className="text-xs">
                    {getStepBadge()}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Input
                placeholder={`Enter amount of ${collateralToken} to supply`}
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                disabled={isTransactionPending}
                type="number"
                min="0"
                step="0.01"
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
              />
              <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
                <span className="font-semibold text-slate-700">{collateralToken}</span>
              </div>
            </div>

            {inputError && (
              <div className="flex items-center gap-1 text-sm text-red-500 mt-2">
                <AlertCircle className="h-3 w-3" />
                {inputError}
              </div>
            )}

            <div className="mt-3 text-xs text-slate-500 flex justify-between items-center">
              <span className="mr-1">Your Balance:</span>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 mx-2">
                  {tokenBalance.balance} {collateralToken}
                </span>
                <button
                  onClick={handleMaxClick}
                  disabled={maxBalance === 0 || isTransactionPending}
                  className="text-xs p-0.5 border border-purple-500 rounded-md text-purple-500 hover:bg-purple-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Max
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Approval Success Message */}
        {isApproveSuccess && !isSupplySuccess && (
          <Card className="border border-green-200 bg-green-50 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>
                  Token approval successful! You can now supply your {collateralToken} as collateral.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {(approveError || supplyError) && (
          <Card className="border border-red-200 bg-red-50 shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {(approveError || supplyError)?.message || "Transaction failed"}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Progress */}
        {isTransactionPending && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Transaction Progress</span>
              <span className="text-slate-500">{getStepText()}</span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </div>
        )}

        {/* Transaction Hash */}
        {(approveHash || supplyHash) && !isSupplySuccess && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className={`w-2 h-2 rounded-full ${
                  isSupplySuccess ? "bg-green-500" : "bg-yellow-500"
                }`}
              />
              <span className="text-xs text-gray-600">
                {currentStep === "approving" ? "Approval" : "Supply"} Transaction
              </span>
            </div>
            <a
              href={`https://testnet.snowtrace.io/tx/${currentStep === "approving" ? approveHash : supplyHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all flex items-center gap-1"
            >
              {(currentStep === "approving" ? approveHash : supplyHash)?.slice(0, 20)}...{(currentStep === "approving" ? approveHash : supplyHash)?.slice(-10)}
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          onClick={handleAction}
          disabled={!amount || Number(amount) <= 0 || isTransactionPending || !!inputError}
          className={`w-full h-12 text-base font-medium rounded-lg duration-300 transition-colors ${
            !amount || Number(amount) <= 0 || isTransactionPending || !!inputError
              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
              : isApproveSuccess && !isSupplySuccess
              ? "bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white font-medium shadow-md hover:shadow-lg cursor-pointer"
              : "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {isTransactionPending ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>{getButtonText()}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Shield className="mr-2 h-5 w-5" />
              <span>{getButtonText()}</span>
            </div>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default SupplyCollateralSection;


"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, CheckCircle2, AlertCircle, ClipboardCopy, ExternalLink } from "lucide-react";
import { tokens } from "@/constants/token-address";
import { useBalance } from "@/hooks/useBalance";
import { useSupplyCollateral, useApproveCollateral } from "@/hooks/write/useSupplyCollateral";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { chains } from "@/constants/chain-address";
import { useAccount } from "wagmi";

interface SupplyDialogProps {
  token: string | undefined;
  lpAddress?: string;
  onSuccess?: () => void;
}

export default function SupplyDialogCol({ token, lpAddress, onSuccess }: SupplyDialogProps) {
  const CHAIN_ID = 43113;
  const { address, chainId } = useAccount();

  const selectedToken = tokens.find(
    (t) => t.symbol === token && t.addresses[CHAIN_ID]
  );

  const tokenAddress = selectedToken?.addresses[CHAIN_ID] as `0x${string}` | undefined;
  const decimals = selectedToken?.decimals ?? 18;

  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [inputError, setInputError] = useState("");
  const [currentStep, setCurrentStep] = useState<"idle" | "approving" | "supplying">("idle");

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

  const { balance } = useBalance(tokenAddress!, decimals);

  const explorer = chains.find((c) => c.id === chainId)?.contracts.blockExplorer;
  const maxBalance = Number.parseFloat(balance) || 0;

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

  const handleClose = () => {
    setIsOpen(false);
    setAmount("");
    setInputError("");
    setCurrentStep("idle");
    resetApprove();
    resetSupply();
  };

  const copyTxHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    toast.success("Transaction hash copied!");
  };

  // Handle success state
  useEffect(() => {
    if (isSupplySuccess) {
      onSuccess?.();
      toast.success("Supply collateral successful!");
    }
  }, [isSupplySuccess, onSuccess]);

  const isAmountValid = amount && !inputError && Number.parseFloat(amount) > 0;

  // Determine if we should show the supply button
  const shouldShowSupplyButton = isApproveSuccess && !isSupplySuccess;

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

    if (shouldShowSupplyButton) {
      return `Supply ${token} as Collateral`;
    }

    return `Approve ${token}`;
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

  const currentError = approveError || supplyError;
  const currentTxHash = currentStep === "approving" ? approveHash : supplyHash;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-[#141beb] hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
          size="lg"
          disabled={!selectedToken}
        >
          Supply {token}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl backdrop-blur-md">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-500" />
            <DialogTitle className="text-xl font-bold text-slate-800">
              {isSupplySuccess
                ? "Supply Successful!"
                : `Supply ${token} as Collateral`}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Success State */}
        {isSupplySuccess ? (
          <div className="text-center space-y-4 py-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <p className="text-slate-600">
              Your {amount} {token} has been supplied as collateral successfully.
            </p>

            {supplyHash && (
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      Supply Transaction:
                    </span>
                    <div className="flex items-center gap-2">
                      <a
                        href={`${explorer}/tx/${supplyHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        View on Explorer
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyTxHash(supplyHash)}
                        className="h-6 w-6 p-0"
                      >
                        <ClipboardCopy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              onClick={handleClose}
              className="w-full h-12 text-base font-medium rounded-lg bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300"
            >
              Close
            </Button>
          </div>
        ) : (
          /* Input State */
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
                      placeholder={`Enter amount of ${token} to supply`}
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      disabled={isTransactionPending}
                      type="number"
                      min="0"
                      step="0.01"
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
                    />
                    <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
                      <span className="font-semibold text-slate-700">{token}</span>
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
                        {balance} {token}
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
              {shouldShowSupplyButton && (
                <Card className="border border-green-200 bg-green-50 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>
                        Token approval successful! You can now supply your {token} as collateral.
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Error Display */}
              {currentError && (
                <Card className="border border-red-200 bg-red-50 shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>
                        {currentError.message || "Transaction failed"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Transaction Hash */}
              {currentTxHash && !isSupplySuccess && (
                <Card className="border border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">
                        {currentStep === "approving" ? "Approval:" : "Supply:"}
                      </span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`${explorer}/tx/${currentTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline flex items-center gap-1"
                        >
                          {currentTxHash.slice(0, 6)}...{currentTxHash.slice(-4)}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyTxHash(currentTxHash)}
                          className="h-6 w-6 p-0"
                        >
                          <ClipboardCopy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <DialogFooter>
              <Button
                onClick={handleAction}
                disabled={!isAmountValid || isTransactionPending}
                className={`w-full h-12 text-base font-medium rounded-lg ${
                  !isAmountValid || isTransactionPending
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : shouldShowSupplyButton
                    ? "bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300"
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
        )}
      </DialogContent>
    </Dialog>
  );
}

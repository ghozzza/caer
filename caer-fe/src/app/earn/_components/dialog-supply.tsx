"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCopy,
  CreditCard,
  DollarSign,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSupply } from "@/hooks/write/useSupplyLiquidity";
import { useBalance } from "@/hooks/useBalance";
import { tokens } from "@/constants/token-address";
import { chains } from "@/constants/chain-address";

const DialogSupply = ({
  borrowToken,
  onSuccess,
  lpAddress,
}: {
  borrowToken?: string;
  onSuccess?: () => void;
  lpAddress?: string;
}) => {
  const CHAIN_ID = 43113;
  const { address, chainId } = useAccount();

  const selectedToken = tokens.find(
    (t) => t.addresses[CHAIN_ID] === borrowToken
  );
  const tokenName = selectedToken?.name ?? "Token";
  const tokenSymbol = selectedToken?.symbol ?? "";
  const decimals = selectedToken?.decimals ?? 18;

  const { balance: userBalance } = useBalance(
    borrowToken as `0x${string}`,
    decimals
  );

  const {
    supply,
    proceedToSupply,
    isApprovePending,
    isSupplyPending,
    isApproveLoading,
    isSupplyLoading,
    isProcessing,
    isSuccess,
    isApproveSuccess,
    error,
    txHash,
    approveHash,
    supplyHash,
    currentStep,
    reset,
  } = useSupply(CHAIN_ID, borrowToken, lpAddress);

  /* ── UI state ─────────────────────────────────────────────────────────── */
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [inputError, setInputError] = useState("");

  const explorer = chains.find((c) => c.id === chainId)?.contracts
    .blockExplorer;
  const maxBalance = Number.parseFloat(userBalance) || 0;

  const isTransactionPending =
    isApprovePending ||
    isSupplyPending ||
    isApproveLoading ||
    isSupplyLoading ||
    isProcessing;

  // Auto-proceed to supply step when approval is successful
  useEffect(() => {
    if (isApproveSuccess && currentStep === "approving" && amount) {
      proceedToSupply(amount);
    }
  }, [isApproveSuccess, currentStep, amount, proceedToSupply]);

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

  const handleSupply = () => {
    const error = validateAmount(amount);
    if (error) {
      setInputError(error);
      toast.error(error);
      return;
    }

    supply(amount);
  };

  const handleClose = () => {
    setIsOpen(false);
    setAmount("");
    setInputError("");
    reset();
  };

  const copyTxHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      toast.success("Transaction hash copied!");
    }
  };

  // Handle success state
  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
      toast.success("Supply successful!");
    }
  }, [isSuccess, onSuccess]);

  const isAmountValid = amount && !inputError && Number.parseFloat(amount) > 0;

  const getLoadingMessage = () => {
    if (currentStep === "approving") {
      return isApprovePending ? "Confirm Approval..." : "Approving Token...";
    }
    if (currentStep === "supplying") {
      return isSupplyPending ? "Confirm Supply..." : "Supplying...";
    }
    return "Processing Transaction...";
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              if (!address) {
                toast.error("Please connect your wallet");
                return;
              }
              setIsOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-400 to-blue-600 text-white shadow-md hover:shadow-lg"
          >
            Supply
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6 text-blue-500" />
              <DialogTitle className="text-xl font-bold text-slate-800">
                {isSuccess ? "Supply Successful!" : `Supply ${tokenSymbol}`}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Success State */}
          {isSuccess ? (
            <div className="text-center space-y-4 py-6">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-slate-600">
                Your {amount} {tokenSymbol} has been supplied successfully.
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
                          onClick={() => {
                            navigator.clipboard.writeText(supplyHash);
                            toast.success("Transaction hash copied!");
                          }}
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
                className="w-full h-12 text-base font-medium rounded-lg bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg"
              >
                Close
              </Button>
            </div>
          ) : (
            /* Input State */
            <>
              <div className="space-y-6 py-4">
                <Card className="border border-slate-200 bg-white shadow-sm">
                  <CardContent className="px-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium text-slate-700">
                        Supply Amount
                      </h3>
                      {currentStep !== "idle" && (
                        <Badge variant="secondary" className="text-xs">
                          {currentStep === "approving"
                            ? "Step 1/2: Approving"
                            : "Step 2/2: Supplying"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <Input
                        placeholder={`Enter amount of ${tokenSymbol}`}
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        disabled={isTransactionPending}
                        className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
                      />
                      <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
                        <DollarSign className="h-4 w-4 text-slate-700" />
                        <span className="font-semibold text-slate-700">
                          {tokenSymbol}
                        </span>
                      </div>
                    </div>

                    {inputError && (
                      <div className="flex items-center gap-1 text-sm text-red-500 mt-2">
                        <AlertCircle className="h-3 w-3" />
                        {inputError}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs mt-2">
                      <span className="text-gray-400">Your balance:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-600">{userBalance}</span>
                        <button
                          onClick={handleMaxClick}
                          disabled={maxBalance === 0 || isTransactionPending}
                          className="text-xs px-2 p-0.5 border border-blue-500 rounded-md text-blue-500 hover:bg-blue-200 cursor-pointer duration-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Max
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Error Display */}
                {error && (
                  <Card className="border border-red-200 bg-red-50 shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>{error.message || "Supply failed"}</span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Transaction Hash */}
                {txHash && !isSuccess && (
                  <Card className="border border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">
                          {currentStep === "approving"
                            ? "Approval:"
                            : "Supply:"}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`${explorer}/tx/${txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline flex items-center gap-1"
                          >
                            {txHash.slice(0, 6)}...{txHash.slice(-4)}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={copyTxHash}
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
                  onClick={handleSupply}
                  disabled={!isAmountValid || isTransactionPending}
                  className={`w-full h-12 text-base font-medium rounded-lg ${
                    !isAmountValid || isTransactionPending
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {isTransactionPending ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>{getLoadingMessage()}</span>
                    </div>
                  ) : (
                    <span>Supply {tokenSymbol}</span>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DialogSupply;

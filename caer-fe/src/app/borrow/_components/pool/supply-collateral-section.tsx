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
import { useSupplyCollateral } from "@/hooks/write/useSupplyCollateral";
import { tokens } from "@/constants/token-address";
import { createPosition } from "@/actions/CreatePosition";
import { useAccount } from "wagmi";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from 'lucide-react';

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

  const tokenInfo = tokens.find(
    (token) => token.name === collateralToken && token.addresses[CHAIN_ID]
  );
  const tokenAddress = tokenInfo?.addresses[CHAIN_ID] as `0x${string}`;
  const tokenDecimals = tokenInfo?.decimals ?? 18;

  const { address } = useAccount();
  const {
    supply,
    isApprovePending,
    isSupplyPending,
    isApproveLoading,
    isSupplyLoading,
    isProcessing,
    error,
    isSuccess,
    approveHash,
    supplyHash,
    currentStep,
    isApproveSuccess,
  } = useSupplyCollateral(CHAIN_ID, tokenAddress, lpAddress);

  const tokenBalance = useBalance(tokenAddress, tokenDecimals);

  const handleSupply = async () => {
    if (!amount || isNaN(Number(amount))) return;
    await supply(amount);
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

  useEffect(() => {
    if (isSuccess && tokenAddress) {
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
    isSuccess,
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
  if (showSuccessState && isSuccess) {
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

  return (
    <>
      <div className="space-y-6 py-4">
        {/* Progress Indicator */}
        {isProcessing && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {getStepText()}
              </span>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
            <div className="mt-2 text-xs text-blue-600">
              Step{" "}
              {currentStep === "approving"
                ? "1"
                : currentStep === "supplying"
                ? "2"
                : "2"}{" "}
              of 2
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-slate-700">
                Supply Amount
              </h3>
              <Badge
                variant="outline"
                className="bg-purple-50 text-purple-700 border-purple-200"
              >
                Collateral
              </Badge>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
              <Input
                placeholder={`Enter amount of ${collateralToken} to supply`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min="0"
                step="0.01"
                disabled={isProcessing}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium"
              />
              <div className="flex items-center gap-1 bg-slate-200 px-3 py-1 rounded-md">
                <span className="font-semibold text-slate-700">
                  {collateralToken}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs text-slate-500 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>Your Balance:</span>
                <Button
                  onClick={handleRefetch}
                  disabled={isRefetching}
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                >
                  <RefreshCw
                    className={`h-3 w-3 ${isRefetching ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 mx-2">
                  {tokenBalance.balance} {collateralToken}
                </span>
                <button
                  onClick={() => setAmount(tokenBalance.balance)}
                  disabled={isProcessing}
                  className="text-xs p-0.5 border border-purple-500 rounded-md text-purple-500 hover:bg-purple-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Max
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Hashes During Processing */}
        {(approveHash || supplyHash) && !showSuccessState && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Transaction Status
            </h4>

            {approveHash && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isApproveSuccess ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-xs text-gray-600">
                    Approval Transaction
                  </span>
                </div>
                <a
                  href={`https://testnet.snowtrace.io/tx/${approveHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all flex items-center gap-1"
                >
                  {approveHash.slice(0, 20)}...{approveHash.slice(-10)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            {supplyHash && (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSuccess ? "bg-green-500" : "bg-yellow-500"
                    }`}
                  />
                  <span className="text-xs text-gray-600">
                    Supply Transaction
                  </span>
                </div>
                <a
                  href={`https://testnet.snowtrace.io/tx/${supplyHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-blue-600 hover:text-blue-800 underline break-all flex items-center gap-1"
                >
                  {supplyHash.slice(0, 20)}...{supplyHash.slice(-10)}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          onClick={handleSupply}
          disabled={isProcessing || !amount || Number(amount) <= 0}
          className={`w-full h-12 text-base font-medium rounded-lg duration-300 transition-colors ${
            isProcessing
              ? "bg-slate-200 text-slate-500"
              : "bg-gradient-to-r from-[#01ECBE] to-[#141beb] hover:from-[#141beb] hover:to-[#01ECBE] text-white font-medium shadow-md hover:shadow-lg cursor-pointer"
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>{getStepText()}</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Shield className="mr-2 h-5 w-5" />
              <span>{`Supply ${collateralToken} as Collateral`}</span>
            </div>
          )}
        </Button>
      </DialogFooter>
    </>
  );
};

export default SupplyCollateralSection;

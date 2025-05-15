import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";
import ChainSelectorButton from "@/components/dialog/borrow/chain-selector-button";
import AmountInput from "@/components/dialog/borrow/amount-input";
import RecipientInput from "@/components/dialog/borrow/recipient-input";
import { Chain } from "@/types/type";
import useOnChainTransactionHandler from "@/components/dialog/borrow/onchain-transaction-handler";
import useTransactionHandler from "@/components/dialog/borrow/transaction-handler";

interface BorrowSectionProps {
  onTransactionSuccess?: () => void;
  collateralToken: string;
  loanToken: string;
  lpAddress: string;
}

const BorrowSection = ({
  onTransactionSuccess,
  collateralToken,
  loanToken,
  lpAddress,
}: BorrowSectionProps) => {
  const [fromChain, setFromChain] = useState<Chain>({
    id: 50002,
    name: "Base",
    type: "Testnet",
    logoUrl: "/base-logo.jpg",
  });
  const [toChain, setToChain] = useState<Chain>({
    id: 50002,
    name: "Base",
    type: "Testnet",
    logoUrl: "/base-logo.jpg",
  });
  const [amount, setAmount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txCompleted, setTxCompleted] = useState(false);

  const isOnChainTransaction = fromChain.id === 50002 && toChain.id === 50002;

  // Handle transaction success
  const handleTransactionSuccess = useCallback(() => {
    console.log("Transaction success callback triggered");
    setTxCompleted(true);
    setIsLoading(false);
    onTransactionSuccess?.();
  }, [onTransactionSuccess]);

  // Use the appropriate transaction handler based on the chains.
  const onChainHandler = useOnChainTransactionHandler({
    amount,
    token: loanToken,
    fromChain,
    toChain,
    recipientAddress,
    lpAddress,
    onSuccess: handleTransactionSuccess,
    onLoading: setIsLoading,
  });

  const crossChainHandler = useTransactionHandler({
    amount,
    token: loanToken,
    fromChain,
    toChain,
    recipientAddress,
    lpAddress,
    onSuccess: handleTransactionSuccess,
    onLoading: setIsLoading,
  });

  // Choose the appropriate handler based on the transaction type
  const handler = isOnChainTransaction ? onChainHandler : crossChainHandler;
  const handleTransaction = handler.handleTransaction;
  const TransactionProgress = handler.TransactionProgress;

  const processingState =
    "isProcessing" in handler && typeof handler.isProcessing === "boolean"
      ? handler.isProcessing
      : false;

  let buttonText = `Borrow ${loanToken}`;
  if (isLoading || processingState) {
    buttonText = "Processing...";
  } else if (txCompleted) {
    buttonText = "Completed";
  }

  return (
    <>
      <div className="space-y-6 py-4">
        <ChainSelectorButton
          fromChain={fromChain}
          toChain={toChain}
          setFromChain={setFromChain}
          setToChain={setToChain}
        />
        <AmountInput token={loanToken} value={amount} onChange={setAmount} />

        {/* Only show recipient input for cross-chain transactions */}
        {!isOnChainTransaction && (
          <>
            <RecipientInput
              value={recipientAddress}
              onChange={setRecipientAddress}
            />
            <div className="p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-blue-600">
                <strong>Important: </strong>For cross-chain borrowing, please
                use this gas limit:{" "}
              </span>
              <button
                className="cursor-pointer text-sm text-blue-700 text-bold hover:text-blue-800 bg-transparent border-none p-0"
                onClick={() => {
                  navigator.clipboard.writeText("15694186");
                  toast.success("Gas limit copied to clipboard!");
                }}
              >
                15694186 <Copy className="inline-block w-3 h-3 ml-1" />
              </button>
            </div>
          </>
        )}

        {isOnChainTransaction && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">
              <strong>On-chain Transaction:</strong> Borrowing directly on Base
              Chain using your position.
            </p>
          </div>
        )}

        {txCompleted && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg animate-pulse">
            <p className="text-sm text-green-600 text-center font-medium">
              Transaction completed successfully! Closing dialog...
            </p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          onClick={handleTransaction}
          className="w-full bg-gradient-to-r from-[#141beb] to-[#01ECBE] hover:from-[#01ECBE] hover:to-[#141beb] text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
          disabled={isLoading || processingState || txCompleted || !amount}
        >
          {buttonText}
          {TransactionProgress}
        </Button>
      </DialogFooter>
    </>
  );
};

export default BorrowSection;

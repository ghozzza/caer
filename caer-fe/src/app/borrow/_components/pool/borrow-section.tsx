import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { History, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";
import ChainSelectorButton from "@/components/dialog/borrow/chain-selector-button";
import AmountInput from "@/components/dialog/borrow/amount-input";
import TransactionSuccessDialog from "@/components/dialog/borrow/transaction-success-dialog";
import BorrowHistoryDialog from "@/components/dialog/borrow/borrow-history-dialog";
import { useBorrow } from "@/hooks/write/useBorrow";
import { tokens } from "@/constants/token-address";
import { saveBorrowToHistory } from "@/utils/borrow-history";

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
  const [fromChain, setFromChain] = useState<Number>(43113);
  const [toChain, setToChain] = useState<Number>(43113);
  const [amount, setAmount] = useState("");
  const [txCompleted, setTxCompleted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const decimal = tokens.find((token) => token.name === loanToken)?.decimals;

  const { 
    handleBorrow, 
    isProcessing, 
    isSuccess, 
    borrowHash,
  } = useBorrow(
      Number(toChain),
      amount,
      lpAddress,
      Number(decimal)
    );

  // Handle successful transaction
  useEffect(() => {
    if (isSuccess && borrowHash) {
      setTxCompleted(true);
      
      // Save to history
      saveBorrowToHistory(
        borrowHash,
        collateralToken,
        loanToken,
        amount,
        Number(toChain)
      );
      
      // Show success toast
      if (Number(toChain) === 43113) {
        // Onchain success - show success toast
        toast.success("Transaction successful! Your borrow has been completed on Avalanche Fuji.");
      } else if (Number(toChain) === 11155111) {
        // Ethereum - show 1 hour estimation toast
        toast.info("Transaction submitted successfully! Estimated completion time: 1 hour for Ethereum processing.");
      } else {
        // Other crosschain - show 5 minutes estimation toast
        toast.info("Transaction submitted successfully! Estimated completion time: 5 minutes for cross-chain processing.");
      }
      
      // Open the success dialog
      setShowSuccessDialog(true);
      
      // Call success callback if provided
      if (onTransactionSuccess) {
        onTransactionSuccess();
      }
    }
  }, [isSuccess, borrowHash, collateralToken, loanToken, amount, toChain, onTransactionSuccess]);
  
  let buttonText = `Borrow ${loanToken}`;
  if (isProcessing) {
    buttonText = "Processing...";
  } else if (txCompleted) {
    buttonText = "Completed";
  }

  return (
    <>
      <div className="space-y-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Borrow {loanToken}</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryDialog(true)}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            History
          </Button>
        </div>
        
        <ChainSelectorButton
          fromChain={Number(fromChain)}
          toChain={Number(toChain)}
          setFromChain={setFromChain}
          setToChain={setToChain}
        />
        <AmountInput token={loanToken} value={amount} onChange={setAmount} />
      </div>

      <DialogFooter>
        {/* Main Borrow Button */}
        <Button
          onClick={handleBorrow}
          className="w-full bg-gradient-to-r from-[#141beb] to-[#01ECBE] hover:from-[#01ECBE] hover:to-[#141beb] text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
          disabled={isProcessing || txCompleted || !amount}
        >
          {buttonText}
          {isProcessing && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
        </Button>
      </DialogFooter>

      {/* Transaction Success Dialog */}
      <TransactionSuccessDialog
        isOpen={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        transactionHash={borrowHash || ""}
        destinationChainId={Number(toChain)}
        fromToken={collateralToken}
        toToken={loanToken}
        amount={amount}
      />

      {/* Borrow History Dialog */}
      <BorrowHistoryDialog
        isOpen={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />
    </>
  );
};

export default BorrowSection;

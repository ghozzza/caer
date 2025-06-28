import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";
import ChainSelectorButton from "@/components/dialog/borrow/chain-selector-button";
import AmountInput from "@/components/dialog/borrow/amount-input";
import RecipientInput from "@/components/dialog/borrow/recipient-input";
import { Chain, DestinationChain } from "@/types/type";
import useOnChainTransactionHandler from "@/components/dialog/borrow/onchain-transaction-handler";
import { useBorrow } from "@/hooks/write/useBorrow";
import { tokens } from "@/constants/token-address";

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

  const decimal = tokens.find((token) => token.name === loanToken)?.decimals;

  const { handleBorrow, isProcessing, isSuccess, borrowHash, borrowError } =
    useBorrow(
      Number(toChain),
      amount,
      lpAddress,
      Number(decimal)
    );


  let buttonText = `Borrow ${loanToken}`;
  if (isProcessing) {
    buttonText = "Processing...";
  } else if (txCompleted) {
    buttonText = "Completed";
  }

  return (
    <>
      <div className="space-y-6 py-4">
        <ChainSelectorButton
          fromChain={Number(fromChain)}
          toChain={Number(toChain)}
          setFromChain={setFromChain}
          setToChain={setToChain}
        />
        <AmountInput token={loanToken} value={amount} onChange={setAmount} />
      </div>

      <DialogFooter>
        <Button
          onClick={handleBorrow}
          className="w-full bg-gradient-to-r from-[#141beb] to-[#01ECBE] hover:from-[#01ECBE] hover:to-[#141beb] text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
          disabled={isProcessing || txCompleted || !amount}
        >
          {buttonText}
          {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
        </Button>
      </DialogFooter>
    </>
  );
};

export default BorrowSection;

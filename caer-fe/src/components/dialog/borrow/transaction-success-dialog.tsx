import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface TransactionSuccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactionHash: string;
  destinationChainId: number;
  fromToken: string;
  toToken: string;
  amount: string;
}

const TransactionSuccessDialog: React.FC<TransactionSuccessDialogProps> = ({
  isOpen,
  onOpenChange,
  transactionHash,
  destinationChainId,
  fromToken,
  toToken,
  amount,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(() => {
    // Set initial time based on chain: 1 hour for Ethereum, 5 minutes for others
    return destinationChainId === 11155111 ? 3600 : 300; // 3600 seconds = 1 hour, 300 seconds = 5 minutes
  });
  const [isCompleted, setIsCompleted] = useState(false);

  // For Avalanche Fuji (43113), mark as completed immediately since we already have confirmation
  // For other chains, use timer
  const isAvalancheFuji = destinationChainId === 43113;

  useEffect(() => {
    if (isAvalancheFuji) {
      setIsCompleted(true);
      return;
    }

    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsCompleted(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isAvalancheFuji]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  const getExplorerUrl = () => {
    if (destinationChainId === 43113) {
      return `https://testnet.snowtrace.io/tx/${transactionHash}`;
    }
    return `https://ccip.chain.link/?search=${transactionHash}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transactionHash);
    toast.success("Transaction hash copied to clipboard");
  };

  const openExplorer = () => {
    window.open(getExplorerUrl(), "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Transaction Submitted
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Transaction Details</div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">From:</span>
                <span className="text-sm font-medium">{fromToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">To:</span>
                <span className="text-sm font-medium">{toToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Amount:</span>
                <span className="text-sm font-medium">{amount}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Transaction Hash:</div>
            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded border">
              <span className="text-xs font-mono truncate flex-1">
                {transactionHash}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyToClipboard}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <div className="text-sm font-medium">
                {isCompleted ? "Transaction Completed" : "Processing..."}
              </div>
              {!isCompleted && !isAvalancheFuji && (
                <div className="text-xs text-gray-600">
                  Estimated time: {formatTime(timeRemaining)}
                  {destinationChainId === 11155111 && " (Ethereum processing)"}
                </div>
              )}
              {isAvalancheFuji && (
                <div className="text-xs text-gray-600">
                  Transaction confirmed on Avalanche Fuji
                </div>
              )}
            </div>
            <div className={`w-3 h-3 rounded-full ${
              isCompleted ? "bg-green-500" : "bg-yellow-500 animate-pulse"
            }`} />
          </div>

          <Button
            onClick={openExplorer}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <ExternalLink className="w-4 h-4" />
            View on Explorer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionSuccessDialog;

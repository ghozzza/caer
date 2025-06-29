import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, ExternalLink } from "lucide-react";

interface BorrowHistoryItem {
  id: string;
  transactionHash: string;
  fromToken: string;
  toToken: string;
  amount: string;
  timestamp: number;
  destinationChainId: number;
  status: "pending" | "completed";
}

interface BorrowHistoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BorrowHistoryDialog: React.FC<BorrowHistoryDialogProps> = ({
  isOpen,
  onOpenChange,
}) => {
  const [historyItems, setHistoryItems] = useState<BorrowHistoryItem[]>([]);

  const loadHistory = () => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("borrowHistory");
    if (savedHistory) {
      const parsedHistory: BorrowHistoryItem[] = JSON.parse(savedHistory);
      
      // Update status based on chain and timestamp
      const updatedHistory = parsedHistory.map(item => {
        // For Avalanche Fuji (43113), keep as completed if already completed
        if (item.destinationChainId === 43113) {
          return {
            ...item,
            status: "completed" as const
          };
        }
        
        // For Ethereum (11155111), use 1-hour timer (3600000ms)
        if (item.destinationChainId === 11155111) {
          return {
            ...item,
            status: (Date.now() - item.timestamp) > 3600000 ? "completed" as const : "pending" as const
          };
        }
        
        // For other chains, use 5-minute timer (300000ms)
        return {
          ...item,
          status: (Date.now() - item.timestamp) > 300000 ? "completed" as const : "pending" as const
        };
      });
      
      setHistoryItems(updatedHistory.reverse()); // Show newest first
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  // Auto-refresh every 30 seconds to update remaining time
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      loadHistory();
    }, 30000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const getExplorerUrl = (transactionHash: string, chainId: number) => {
    if (chainId === 43113) {
      return `https://testnet.snowtrace.io/tx/${transactionHash}`;
    }
    return `https://ccip.chain.link/tx/${transactionHash}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getChainName = (chainId: number) => {
    if (chainId === 43113) return "Avalanche Fuji";
    if (chainId === 11155111) return "Ethereum";
    if (chainId === 421614) return "Arbitrum";
    if (chainId === 84532) return "Base";
    return `Chain ${chainId}`;
  };

  const getEstimationText = (chainId: number) => {
    if (chainId === 43113) return null; // No estimation for Avalanche Fuji (onchain)
    if (chainId === 11155111) return "1 hour"; // Ethereum
    return "5 minutes"; // Other chains (Arbitrum, Base, etc.)
  };

  const getRemainingTime = (item: BorrowHistoryItem) => {
    if (item.status === "completed" || item.destinationChainId === 43113) {
      return null;
    }

    const elapsed = Date.now() - item.timestamp;
    let totalTime: number;
    
    if (item.destinationChainId === 11155111) {
      totalTime = 3600000; // 1 hour for Ethereum
    } else {
      totalTime = 300000; // 5 minutes for other chains
    }

    const remaining = totalTime - elapsed;
    if (remaining <= 0) return null;

    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    if (item.destinationChainId === 11155111) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (hours > 0) {
        return `${hours}h ${remainingMinutes}m remaining`;
      } else {
        return `${minutes}m ${seconds}s remaining`;
      }
    } else {
      return `${minutes}m ${seconds}s remaining`;
    }
  };

  const openExplorer = (transactionHash: string, chainId: number) => {
    window.open(getExplorerUrl(transactionHash, chainId), "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Borrow History
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          {historyItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No borrow history found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {historyItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{item.fromToken}</span>
                        <span>→</span>
                        <span className="font-medium">{item.toToken}</span>
                      </div>
                      <div className="text-lg font-semibold">
                        {item.amount} {item.toToken}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        variant={item.status === "completed" ? "default" : "secondary"}
                        className={
                          item.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {item.status === "completed" ? "Completed" : "Processing"}
                      </Badge>
                      {/* Chain name */}
                      <div className="text-xs text-gray-500">
                        {getChainName(item.destinationChainId)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{formatDate(item.timestamp)}</div>
                    {/* Show estimation for crosschain transactions */}
                    {item.destinationChainId !== 43113 && (
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600">
                          Estimated: {getEstimationText(item.destinationChainId)}
                        </span>
                        {item.status === "pending" && getRemainingTime(item) && (
                          <span className="text-orange-600 font-medium">
                            ({getRemainingTime(item)})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-mono truncate flex-1">
                      {item.transactionHash}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openExplorer(item.transactionHash, item.destinationChainId)}
                      className="h-6 px-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowHistoryDialog;

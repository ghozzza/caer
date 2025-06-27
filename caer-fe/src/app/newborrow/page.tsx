"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import type { Chain, Token } from "@/types/type";
import { useAccount } from "wagmi";

import { BorrowInputForm } from "@/components/borrow/input-form";
import { BorrowReviewDetails } from "@/components/borrow/review-borrow";
import { TransactionHistoryPanel } from "@/components/borrow/transaction-history-panel";

export default function CrossChainBorrowing() {
  const [selectedCollateralChain, setSelectedCollateralChain] = useState<Chain | null>(null);
  const [selectedCollateralToken, setSelectedCollateralToken] = useState<Token | null>(null);
  const [isCollateralDialogOpen, setIsCollateralDialogOpen] = useState(false);

  const [selectedBorrowChain, setSelectedBorrowChain] = useState<Chain | null>(null);
  const [selectedBorrowToken, setSelectedBorrowToken] = useState<Token | null>(null);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [borrowStage, setBorrowStage] = useState<"input" | "review" | "borrowing">("input");
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(false);

  // Wagmi account
  const { address } = useAccount();

  // CCIP history state
  const [ccipHistory, setCcipHistory] = useState<any[]>([]);

  // Transaction history hooks (local DB)
  const userAddress = address || "not-found";
  const { createTransaction, getTransactions, updateTransaction } = useTransactionHistory(userAddress);

  const mockGasFee = "0.0045";
  const mockCollateralPrice = "2,340.50";
  const mockBorrowPrice = "1.00";
  const mockLTV = "75";

  // Fetch local DB transactions
  const fetchTransactions = async () => {
    setIsLoadingTx(true);
    try {
      const txs = await getTransactions();
      setTransactions(txs);
    } catch {
      setTransactions([]);
    }
    setIsLoadingTx(false);
  };

  // Real-time fetch CCIP tx history (polling every 10s)
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    const fetchHistory = async () => {
      if (address) {
        try {
          const res = await fetch(`https://ccip.chain.link/address/${address}`);
          const data = await res.json();
          setCcipHistory(data.transactions || []);
        } catch {
          setCcipHistory([]);
        }
      }
    };
    fetchHistory();
    interval = setInterval(fetchHistory, 10000);
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [address]);

  // Deteksi status transaksi CCIP (pending/success)
  const isAnyCcipTxPending = ccipHistory.some(
    (tx) => tx.status === "pending" || tx.status === "processing"
  );

  // Simulasi konfirmasi transaksi (local DB)
  const handleConfirmBorrow = async () => {
    if (
      !selectedCollateralToken ||
      !selectedBorrowToken ||
      !selectedCollateralChain ||
      !selectedBorrowChain
    )
      return;
    setBorrowStage("borrowing");

    try {
      const transaction = await createTransaction({
        user_address: userAddress,
        collateral_token: selectedCollateralToken.symbol,
        collateral_chain: selectedCollateralChain.name,
        borrow_token: selectedBorrowToken.symbol,
        borrow_chain: selectedBorrowChain.name,
        borrow_amount: borrowAmount,
        gas_fee_estimate: mockGasFee,
        collateral_price: mockCollateralPrice,
        borrow_price: mockBorrowPrice,
        ltv_ratio: mockLTV,
        status: "pending",
      });

      setTimeout(async () => {
        const isSuccess = Math.random() > 0.3;
        if (isSuccess) {
          const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;
          await updateTransaction(transaction.id, {
            status: "confirmed",
            tx_hash: mockTxHash,
          });
        } else {
          await updateTransaction(transaction.id, {
            status: "failed",
            error_message: "Transaction failed due to insufficient gas",
          });
        }
        fetchTransactions();
        setTimeout(() => {
          setBorrowStage("input");
          setBorrowAmount("");
          setSelectedCollateralChain(null);
          setSelectedCollateralToken(null);
          setSelectedBorrowChain(null);
          setSelectedBorrowToken(null);
        }, 3000);
      }, 5000);
    } catch (error) {
      console.error("Error processing borrow:", error);
      setBorrowStage("input");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cross-Chain Borrow</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowHistory((v) => !v);
              if (!showHistory) fetchTransactions();
            }}
          >
            <History className="h-6 w-6" />
          </Button>
        </CardHeader>

        {/* CCIP Transaction History (real-time) */}
        {address && ccipHistory.length > 0 && (
          <div className="p-4">
            <h4 className="font-semibold mb-2">CCIP Transaction History</h4>
            <ul className="text-sm space-y-1">
              {ccipHistory.map((tx) => (
                <li key={tx.hash} className="flex items-center gap-2">
                  <span className="truncate">{tx.hash}</span>
                  <span
                    className={
                      tx.status === "pending" || tx.status === "processing"
                        ? "text-yellow-600"
                        : tx.status === "success"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {tx.status}
                  </span>
                </li>
              ))}
            </ul>
            {isAnyCcipTxPending && (
              <div className="text-yellow-600 mt-2">
                Ada transaksi yang masih berlangsung...
              </div>
            )}
          </div>
        )}

        {showHistory ? (
          <TransactionHistoryPanel
            transactions={transactions}
            isLoading={isLoadingTx}
            onRefresh={fetchTransactions}
            onBack={() => setShowHistory(false)}
          />
        ) : borrowStage === "input" ? (
          <BorrowInputForm
            selectedCollateralChain={selectedCollateralChain}
            selectedCollateralToken={selectedCollateralToken}
            onCollateralChainSelect={setSelectedCollateralChain}
            onCollateralTokenSelect={setSelectedCollateralToken}
            selectedBorrowChain={selectedBorrowChain}
            selectedBorrowToken={selectedBorrowToken}
            onBorrowChainSelect={setSelectedBorrowChain}
            onBorrowTokenSelect={setSelectedBorrowToken}
            borrowAmount={borrowAmount}
            setBorrowAmount={setBorrowAmount}
            onReview={() => setBorrowStage("review")}
            isCollateralDialogOpen={isCollateralDialogOpen}
            setIsCollateralDialogOpen={setIsCollateralDialogOpen}
            isBorrowDialogOpen={isBorrowDialogOpen}
            setIsBorrowDialogOpen={setIsBorrowDialogOpen}
          />
        ) : borrowStage === "review" &&
          selectedCollateralToken &&
          selectedBorrowToken &&
          selectedCollateralChain &&
          selectedBorrowChain ? (
          <BorrowReviewDetails
            onBack={() => setBorrowStage("input")}
            collateralToken={selectedCollateralToken}
            borrowToken={selectedBorrowToken}
            collateralChain={selectedCollateralChain}
            borrowChain={selectedBorrowChain}
            mockCollateralPrice={mockCollateralPrice}
            mockBorrowPrice={mockBorrowPrice}
            mockLTV={mockLTV}
            mockGasFee={mockGasFee}
            amount={borrowAmount}
            chainId={selectedBorrowChain.id}
            destination={selectedBorrowChain.destination}
          />
        ) : (
          <div className="text-center py-8 text-gray-600 animate-pulse">
            Processing your borrow transaction...
          </div>
        )}
      </Card>
    </div>
  );
}
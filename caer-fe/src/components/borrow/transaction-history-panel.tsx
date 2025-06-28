"use client";

import { CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";


interface Transaction {
  id: string;
  borrow_token: string;
  collateral_token: string;
  status: string;
  created_at: string;
  tx_hash?: string;
  error_message?: string;
}

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  onRefresh: () => void;
  onBack: () => void;
}

export function TransactionHistoryPanel({
  transactions,
  isLoading,
  onRefresh,
  onBack,
}: Props) {
  return (
    <CardContent>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-semibold text-gray-700">Transaction History</span>
        <Button size="sm" variant="outline" onClick={onRefresh} disabled={isLoading}>
          Refresh
        </Button>
      </div>
      <ScrollArea className="h-80">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No transactions found.</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{tx.borrow_token}</span>
                  <span
                    className={`text-xs font-semibold ${
                      tx.status === "confirmed"
                        ? "text-green-600"
                        : tx.status === "failed"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {tx.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {tx.collateral_token} → {tx.borrow_token}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(tx.created_at).toLocaleString()}
                </div>
                {tx.tx_hash && (
                  <div className="text-xs text-blue-600 break-all mt-1">
                    Tx: {tx.tx_hash}
                  </div>
                )}
                {tx.error_message && (
                  <div className="text-xs text-red-600 mt-1">
                    {tx.error_message}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
      <Button className="w-full mt-6" onClick={onBack}>
        Back to Borrow
      </Button>
    </CardContent>
  );
}

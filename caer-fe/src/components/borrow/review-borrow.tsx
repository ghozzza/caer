import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, TrendingUp, Fuel } from "lucide-react";
import type { Token, Chain } from "@/types/type";
import { useBorrow } from "@/hooks/write/useBorrow";
import { useAccount } from "wagmi";
import { useEffect } from "react";

interface Props {
  onBack: () => void;
  collateralToken: Token;
  borrowToken: Token;
  collateralChain: Chain;
  borrowChain: Chain;
  mockCollateralPrice: string;
  mockBorrowPrice: string;
  mockLTV: string;
  mockGasFee: string;
  amount: string;
  chainId: number;
  destination: number;
  onSuccess?: () => void;
}

export function BorrowReviewDetails({
  onBack,
  collateralToken,
  borrowToken,
  collateralChain,
  borrowChain,
  mockCollateralPrice,
  mockBorrowPrice,
  mockLTV,
  mockGasFee,
  amount,
  chainId,
  destination,
  onSuccess,
}: Props) {
  const { address } = useAccount();
  const {
    handleBorrow,
    isProcessing,
    isSuccess,
    borrowHash,
    borrowError,
  } = useBorrow(chainId, destination, amount);

  // Indexing ke DB setelah transaksi sukses
  useEffect(() => {
    if (isSuccess && address && borrowHash) {
      fetch("/api/tx-history", {
        method: "POST",
        body: JSON.stringify({ address, txHash: borrowHash, type: "borrow" }),
        headers: { "Content-Type": "application/json" },
      });
      onSuccess?.();
    }
  }, [isSuccess, address, borrowHash, onSuccess]);

  const onConfirm = async () => {
    await handleBorrow();
  };

  return (
    <CardContent className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" className="p-1 hover:bg-gray-100" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-semibold text-gray-800">Review Borrow</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Collateral</span>
          <div className="flex items-center gap-2">
            <Image src={collateralToken.logo} alt={collateralToken.symbol} width={20} height={20} className="rounded-full" />
            <span>{collateralToken.symbol} on {collateralChain.name}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Borrowing</span>
          <div className="flex items-center gap-2">
            <Image src={borrowToken.logo} alt={borrowToken.symbol} width={20} height={20} className="rounded-full" />
            <span>{borrowToken.symbol} on {borrowChain.name}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <h4 className="font-medium text-gray-800">Price Feeds</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">Collateral Price</div>
            <div className="font-semibold text-lg">${mockCollateralPrice}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            <div className="text-xs text-gray-500">Borrow Asset Price</div>
            <div className="font-semibold text-lg">${mockBorrowPrice}</div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">LTV Ratio</span>
            <span className="font-semibold">{mockLTV}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Fuel className="h-5 w-5 text-orange-500" />
          <span className="font-medium text-gray-800">Estimated Gas Fee</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <span className="font-semibold">{mockGasFee} ETH</span>
        </div>
      </div>

      <Button
        className="w-full h-12 text-lg bg-green-500 hover:bg-green-600 text-white"
        onClick={onConfirm}
        disabled={isProcessing}
      >
        Confirm Borrow
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      {borrowError && (
        <div className="text-red-500 text-sm mt-2">{borrowError.message}</div>
      )}
    </CardContent>
  );
}
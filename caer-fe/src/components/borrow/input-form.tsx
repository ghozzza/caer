"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { TokenChainSelector } from "./token-chain-selector";
import type { Chain, Token } from "@/types/type";

type Props = {
  selectedCollateralChain: Chain | null;
  selectedCollateralToken: Token | null;
  onCollateralChainSelect: (chain: Chain) => void;
  onCollateralTokenSelect: (token: Token) => void;
  selectedBorrowChain: Chain | null;
  selectedBorrowToken: Token | null;
  onBorrowChainSelect: (chain: Chain) => void;
  onBorrowTokenSelect: (token: Token) => void;
  borrowAmount: string;
  setBorrowAmount: (amount: string) => void;
  onReview: () => void;
  isCollateralDialogOpen: boolean;
  setIsCollateralDialogOpen: (open: boolean) => void;
  isBorrowDialogOpen: boolean;
  setIsBorrowDialogOpen: (open: boolean) => void;
};

export function BorrowInputForm({
  selectedCollateralChain,
  selectedCollateralToken,
  onCollateralChainSelect,
  onCollateralTokenSelect,
  selectedBorrowChain,
  selectedBorrowToken,
  onBorrowChainSelect,
  onBorrowTokenSelect,
  borrowAmount,
  setBorrowAmount,
  onReview,
  isCollateralDialogOpen,
  setIsCollateralDialogOpen,
  isBorrowDialogOpen,
  setIsBorrowDialogOpen,
}: Props) {
  return (
    <CardContent className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Collateral
          </label>
          <TokenChainSelector
            selectedChain={selectedCollateralChain}
            selectedToken={selectedCollateralToken}
            onChainSelect={onCollateralChainSelect}
            onTokenSelect={onCollateralTokenSelect}
            placeholder="Select collateral asset"
            isOpen={isCollateralDialogOpen}
            onOpenChange={setIsCollateralDialogOpen}
            title="Select Collateral"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Asset to Borrow
          </label>
          <TokenChainSelector
            selectedChain={selectedBorrowChain}
            selectedToken={selectedBorrowToken}
            onChainSelect={onBorrowChainSelect}
            onTokenSelect={onBorrowTokenSelect}
            placeholder="Select asset to borrow"
            isOpen={isBorrowDialogOpen}
            onOpenChange={setIsBorrowDialogOpen}
            title="Select Asset to Borrow"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Borrow Amount
        </label>
        <div className="relative">
          <Input
            type="number"
            value={borrowAmount}
            onChange={(e) => setBorrowAmount(e.target.value)}
            placeholder="0.00"
            className="h-12 text-lg bg-white border-gray-300 text-gray-800 placeholder-gray-500 pr-20"
          />
          {selectedBorrowToken && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              {selectedBorrowToken.symbol}
            </div>
          )}
        </div>
      </div>

      <Button
        className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600 text-white"
        disabled={
          !selectedCollateralToken || !selectedBorrowToken || !borrowAmount
        }
        onClick={onReview}
      >
        Review Borrow
      </Button>
    </CardContent>
  );
}

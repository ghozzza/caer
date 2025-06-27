"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CreditCard, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tokens } from "@/constants/token-address";
import { useChainId } from "wagmi";
import { useCreatePool } from "@/hooks/write/useCreatePool";

interface DialogCreatePoolProps {
  onRefetch: () => void;
}

const DialogCreatePool: React.FC<DialogCreatePoolProps> = ({ onRefetch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chainId = useChainId();
  const {
    collateralToken,
    borrowToken,
    ltv,
    setCollateralToken,
    setBorrowToken,
    setLtv,
    handleCreate,
    isCreating,
    isConfirming,
  } = useCreatePool(chainId, () => {
    onRefetch();
    setIsOpen(false);
  });

  const filteredTokens = tokens
    .map((token) => {
      const address = token.addresses[chainId];
      return address ? { ...token, address } : null;
    })
    .filter(
      (token): token is typeof token & { address: `0x${string}` } =>
        token !== null
    );

  const isButtonDisabled =
    isCreating || isConfirming || !collateralToken || !borrowToken || !ltv;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="bg-gradient-to-r from-indigo-400 to-blue-600 hover:from-indigo-500 hover:to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-colors duration-300 rounded-lg cursor-pointer"
          size="default"
        >
          Create Pool
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-blue-500" />
            <DialogTitle className="text-xl font-bold text-slate-800">
              Create Pool
            </DialogTitle>
            <DialogDescription className="hidden">
              Fill in token and LTV
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card className="border border-slate-200 bg-white shadow-sm">
            <CardContent className="px-4">
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-slate-700">
                    Collateral Token
                  </h3>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Select
                    value={collateralToken}
                    onValueChange={(value) => setCollateralToken(value as `0x${string}`)}
                  >
                    <SelectTrigger className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer">
                      <SelectValue placeholder="Select Collateral Token" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTokens.map(
                        (token) =>
                          token.address !== borrowToken && (
                            <SelectItem
                              key={token.address}
                              value={token.address}
                              className="cursor-pointer focus:bg-blue-500/70 focus:text-white duration-300 transition-colors"
                            >
                              {token.name}
                            </SelectItem>
                          )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-slate-700">
                    Borrow Token
                  </h3>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Select value={borrowToken} onValueChange={(value) => setBorrowToken(value as `0x${string}`)}>
                    <SelectTrigger className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer">
                      <SelectValue placeholder="Select Borrow Token" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTokens.map(
                        (token) =>
                          token.address !== collateralToken && (
                            <SelectItem
                              key={token.address}
                              value={token.address}
                              className="cursor-pointer focus:bg-blue-500/70 focus:text-white duration-300 transition-colors"
                            >
                              {token.name}
                            </SelectItem>
                          )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-slate-700">LTV</h3>
                </div>
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Input
                    placeholder="Enter LTV"
                    value={ltv}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setLtv(value);
                      }
                    }}
                    disabled={isCreating}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-lg font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreate}
            disabled={isButtonDisabled}
            className={`w-full h-12 text-base font-medium rounded-lg  ${
              isButtonDisabled
                ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-400 hover:from-blue-600 hover:to-indigo-500 text-white shadow-md hover:shadow-lg cursor-pointer"
            }`}
          >
            {isCreating || isConfirming ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Creating Pool...</span>
              </div>
            ) : (
              <span>Create Pool</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreatePool;

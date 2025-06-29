"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { tokens } from "@/constants/token-address";
import { ArrowBigRight, ChevronDown } from "lucide-react";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";
import { useAccount } from "wagmi";
import SupplyCollateralSection from "./supply-collateral-section";
import BorrowSection from "./borrow-section";
import { RepaySection } from "./repay-section";
import ButtonConnectWallet from "@/components/navbar/button-connect-wallet";
import { DialogDescription } from "@radix-ui/react-dialog";
import WithdrawCollateralDialog from "@/components/dialog/withdraw-collateral-dialog";

interface PoolDialogProps {
  isOpen?: boolean;
  onClose: () => void;
  collateralToken: string;
  loanToken: string;
  ltv: string;
  liquidity: string;
  rate: string;
  lpAddress: string;
  borrowAddress: string;
}

const PoolDialog = ({
  isOpen,
  onClose,
  collateralToken,
  loanToken,
  ltv,
  liquidity,
  rate,
  lpAddress,
  borrowAddress,
}: PoolDialogProps) => {
  const { address } = useAccount();
  const [tab, setTab] = useState("supply");
  const { refetchAll } = useReadLendingData(
    undefined,
    undefined,
    lpAddress as `0x${string}`
  );

  const getTokenLogo = (name: string) => {
    return (
      tokens.find((token) => token.name === name)?.logo ?? "/placeholder.png"
    );
  };

  const handleSuccess = () => {
    onClose();
    refetchAll();
  };

  const tabLabelMap: Record<string, string> = {
    supply: "Supply Collateral",
    withdraw: "Withdraw Collateral",
    borrow: "Borrow Debt",
    repay: "Repay Loan",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogDescription className="hidden">
        ini desc
      </DialogDescription>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-white to-slate-50 border-0 shadow-xl rounded-xl backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <DialogTitle className="text-2xl font-bold text-center">
            <div className="flex items-center justify-center gap-2">
              <TokenLabel
                token={collateralToken}
                logo={getTokenLogo(collateralToken)}
              />
              <ArrowBigRight className="mx-1" />
              <TokenLabel token={loanToken} logo={getTokenLogo(loanToken)} />
            </div>
          </DialogTitle>

          {address ? (
            <div className="mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between cursor-pointer"
                  >
                    {tabLabelMap[tab]}
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>

                {/* Animated Dropdown */}
                <AnimatePresence>
                  <DropdownMenuContent asChild className="w-100 mt-1">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      {Object.entries(tabLabelMap).map(([key, label]) => (
                        <DropdownMenuItem
                          className="cursor-pointer hover:bg-green-100"
                          key={key}
                          onClick={() => setTab(key)}
                        >
                          {label}
                        </DropdownMenuItem>
                      ))}
                    </motion.div>
                  </DropdownMenuContent>
                </AnimatePresence>
              </DropdownMenu>

              <div className="mt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2, delay: 0.2 }}
                  >
                    {tab === "supply" && (
                      <SupplyCollateralSection
                        collateralToken={collateralToken}
                        borrowToken={loanToken}
                        lpAddress={lpAddress}
                        onSuccess={handleSuccess}
                      />
                    )}
                    {tab === "withdraw" && (
                      <WithdrawCollateralDialog
                        collateralToken={collateralToken}
                        lpAddress={lpAddress}
                        onSuccess={handleSuccess}
                      />
                    )}
                    {tab === "borrow" && (
                      <BorrowSection
                        collateralToken={collateralToken}
                        loanToken={loanToken}
                        lpAddress={lpAddress}
                        onTransactionSuccess={onClose}
                      />
                    )}
                    {tab === "repay" && (
                      <RepaySection
                        lpAddress={lpAddress}
                        borrowToken={loanToken}
                        onSuccess={handleSuccess}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-full py-10">
              <ButtonConnectWallet />
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

const TokenLabel = ({ token, logo }: { token: string; logo: string }) => (
  <div className="flex items-center gap-2">
    <Image src={logo} alt={token} width={24} height={24} />
    <span className="text-lg font-bold">{token}</span>
  </div>
);

export default PoolDialog;

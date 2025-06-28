"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useFaucet } from "@/hooks/write/useClaimFaucet";
import { Loader2, ExternalLink, Copy, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useAccount } from "wagmi";
import Image from "next/image";

const FaucetsCardForm = () => {
  const currentChainId = 43113;

  //fetch chain id from wallet
  const { chainId } = useAccount();

  const {
    selectedTokenAddress,
    amount,
    isClaiming,
    isConfirming,
    txHash,
    filteredTokens,
    setSelectedTokenAddress,
    setAmount,
    handleClaim,
    copyTokenAddress,
    addTokenToWallet,
    isSuccess,
    isError,
  } = useFaucet(currentChainId);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const getButtonText = () => {
    if (isClaiming && !isConfirming) return "Submitting...";
    if (isConfirming) return "Confirming...";
    return "Claim";
  };

  const getButtonIcon = () => {
    if (isClaiming || isConfirming) {
      return <Loader2 className="w-4 h-4 animate-spin mr-2" />;
    }
    return null;
  };

  const execAddTokenToWallet = () => {
    if (Number(chainId) == currentChainId) {
      addTokenToWallet();
    } else {
      toast.error("Please switch to the Avalanche Fuji network");
    }
  };

  const execCopyTokenAddress = () => {
    if (Number(chainId) == currentChainId) {
      copyTokenAddress();
    } else {
      toast.error("Please switch to the Avalanche Fuji network");
    }
  };

  return (
    <div className="px-7 w-full space-y-5">
      {/* Token Selection */}
      <Select
        value={selectedTokenAddress}
        onValueChange={setSelectedTokenAddress}
        disabled={isClaiming || isConfirming}
      >
        <SelectTrigger className="w-full bg-white border-[#01ECBE]/30 text-[#07094d]">
          <SelectValue placeholder="Select a token" />
        </SelectTrigger>
        <SelectContent className="bg-white border-[#01ECBE]/30">
          <SelectGroup>
            <SelectLabel className="text-[#07094d]">Available Tokens</SelectLabel>
            <AnimatePresence>
              {filteredTokens.map((token, index) => (
                <motion.div
                  key={token.address}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.1 }}
                >
                  <SelectItem
                    className="transition-colors duration-100 cursor-pointer text-[#07094d] hover:bg-[#01ECBE]/10"
                    value={token.address}
                  >
                    <div className="flex items-center gap-2">
                      <Image src={token.logo} alt={token.name} width={20} height={20} />
                      <span>{token.name}</span>
                    </div>
                  </SelectItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Amount Input */}
      <Input
        value={amount}
        onChange={handleAmountChange}
        disabled={isClaiming || isConfirming}
        className="w-full bg-white border-[#01ECBE]/30 text-[#07094d]"
        placeholder="Enter amount (e.g., 100)"
        type="text"
      />

      {/* Claim Button */}
      <Button
        onClick={handleClaim}
        disabled={isClaiming || isConfirming || !selectedTokenAddress || !amount}
        className="w-full bg-[#141beb] text-white hover:bg-[#141beb]/80 transition-colors duration-300 flex items-center justify-center"
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>

      {/* Transaction Status */}
      {txHash && (
        <div className="space-y-3">
          {isConfirming && (
            <div className="flex items-center gap-2 text-[#07094d] text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming transaction...</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 text-sm font-medium mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Transaction Successful
              </div>
              <div className="text-xs text-green-600">
                Your tokens have been successfully claimed!
              </div>
            </div>
          )}

          {isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Transaction Failed
              </div>
              <div className="text-xs text-red-600">
                Please try again or check your wallet connection.
              </div>
            </div>
          )}

          <div className="text-[#07094d] text-sm">
            <span className="font-medium">Transaction Hash:</span>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                {txHash.slice(0, 6)}...{txHash.slice(-6)}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(txHash);
                  toast.success("Transaction hash copied!");
                }}
                className="text-[#141beb] hover:text-[#141beb]/80 transition-colors"
              >
                <Copy className="w-3 h-3" />
              </button>
              <a
                href={`https://testnet.snowtrace.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#141beb] hover:text-[#141beb]/80 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Token Address Info */}
      {selectedTokenAddress && (
        <div className="text-[#07094d] text-sm">
          <span className="font-medium">Add token to your wallet:</span>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-1">
              {selectedTokenAddress}
            </code>
            <button
              onClick={execCopyTokenAddress}
              className="text-[#141beb] hover:text-[#141beb]/80 transition-colors cursor-pointer"
              title="Copy token address"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={execAddTokenToWallet}
              className="text-[#141beb] hover:text-[#141beb]/80 transition-colors cursor-pointer"
              title="Add token to wallet automatically"
            >
              <Wallet className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaucetsCardForm;

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { addTokenToWalletEnhanced } from "@/lib/walletUtils";
import { Token } from "@/types/type";

interface AddTokenButtonProps {
  tokenAddress: string;
  selectedToken: Token & { address: `0x${string}` };
  chainId?: number;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
  showIcon?: boolean;
}

export const AddTokenButton: React.FC<AddTokenButtonProps> = ({
  tokenAddress,
  selectedToken,
  chainId,
  variant = "outline",
  size = "sm",
  className = "",
  children,
  showIcon = true,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddToken = async () => {
    setIsLoading(true);
    try {
      await addTokenToWalletEnhanced(tokenAddress, selectedToken, chainId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToken}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : showIcon ? (
        <Wallet className="w-4 h-4 mr-2" />
      ) : null}
      {children || "Add to Wallet"}
    </Button>
  );
};

// Simple icon-only version
export const AddTokenIconButton: React.FC<Omit<AddTokenButtonProps, 'children' | 'showIcon'> & {
  title?: string;
}> = ({ title = "Add token to wallet", ...props }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddToken = async () => {
    setIsLoading(true);
    try {
      await addTokenToWalletEnhanced(props.tokenAddress, props.selectedToken, props.chainId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToken}
      disabled={isLoading}
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-[#141beb] hover:text-[#141beb]/80 hover:bg-[#141beb]/10"
      title={title}
    >
      {isLoading ? (
        <div className="w-3 h-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Wallet className="w-3 h-3" />
      )}
    </Button>
  );
}; 
import { toast } from "sonner";
import { Token } from "@/types/type";

export const addTokenToWallet = async (
  tokenAddress: string,
  selectedToken: Token & { address: `0x${string}` }
) => {
  if (!tokenAddress) {
    toast.error("Please select a token first");
    return;
  }

  // Check if wallet supports wallet_watchAsset
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: selectedToken.symbol,
            decimals: selectedToken.decimals,
            image: `${window.location.origin}${selectedToken.logo}`,
          },
        },
      });
      console.log(`${window.location.origin}${selectedToken.logo}`)
      toast.success(`${selectedToken.name} added to your wallet!`);
    } catch (error) {
      console.log("Error adding token to wallet:", error);
      toast.error("Failed to add token to wallet. Please add it manually.");
    }
  } else {
    toast.error("Wallet not found. Please connect your wallet first.");
  }
};

// Enhanced version with better error handling and wallet detection
export const addTokenToWalletEnhanced = async (
  tokenAddress: string,
  selectedToken: Token & { address: `0x${string}` },
  chainId?: number
) => {
  if (!tokenAddress) {
    toast.error("Please select a token first");
    return false;
  }

  if (typeof window === "undefined") {
    toast.error("This feature is only available in a browser environment");
    return false;
  }

  if (!window.ethereum) {
    toast.error("No wallet detected. Please install MetaMask or another compatible wallet.");
    return false;
  }

  try {
    // Check if the wallet supports the wallet_watchAsset method
    const methods = await window.ethereum.request({ method: "wallet_getCapabilities" });
    
    if (methods && methods.snaps && methods.snaps["wallet_watchAsset"]) {
      // Modern wallet with capabilities
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: selectedToken.symbol,
            decimals: selectedToken.decimals,
            image: `${window.location.origin}${selectedToken.logo}`,
          },
        },
      });

      if (wasAdded) {
        toast.success(`${selectedToken.name} added to your wallet!`);
        return true;
      } else {
        toast.info("Token was not added to your wallet");
        return false;
      }
    } else {
      // Fallback for older wallets
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: selectedToken.symbol,
            decimals: selectedToken.decimals,
            image: `${window.location.origin}${selectedToken.logo}`,
          },
        },
      });

      if (wasAdded) {
        toast.success(`${selectedToken.name} added to your wallet!`);
        return true;
      } else {
        toast.info("Token was not added to your wallet");
        return false;
      }
    }
  } catch (error: any) {
    console.error("Error adding token to wallet:", error);
    
    // Handle specific error cases
    if (error.code === 4001) {
      toast.error("User rejected the token addition request");
    } else if (error.code === -32601) {
      toast.error("This wallet doesn't support adding tokens automatically. Please add it manually.");
    } else {
      toast.error("Failed to add token to wallet. Please add it manually.");
    }
    
    return false;
  }
};

// Utility function to check if wallet supports token addition
export const checkWalletTokenSupport = async (): Promise<boolean> => {
  if (typeof window === "undefined" || !window.ethereum) {
    return false;
  }

  try {
    // Try to detect if the wallet supports wallet_watchAsset
    const methods = await window.ethereum.request({ method: "wallet_getCapabilities" });
    return !!(methods && methods.snaps && methods.snaps["wallet_watchAsset"]);
  } catch (error) {
    // If wallet_getCapabilities fails, assume it might support wallet_watchAsset
    return true;
  }
};

// Utility function to get wallet type
export const getWalletType = (): string | null => {
  if (typeof window === "undefined" || !window.ethereum) {
    return null;
  }

  if (window.ethereum.isMetaMask) {
    return "MetaMask";
  }
  
  // Add more wallet detection logic here
  return "Unknown";
}; 
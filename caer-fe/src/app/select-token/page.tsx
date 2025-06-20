"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Wallet } from "lucide-react";

type Token = {
  name: string;
  symbol: string;
  address: string;
  logo: string;
  chainIds: number[];
};

type Chain = {
  id: number;
  name: string;
  logo: string;
  color: string;
  contracts: {
    lendingPool: string;
    factory: string;
    blockExplorer: string;
  };
};

// Mock data
const chains: Chain[] = [
  {
    id: 1,
    name: "Ethereum",
    logo: "/chain/arbitrum.png",
    color: "bg-blue-600",
    contracts: {
      lendingPool: "0xEtlPoolETH",
      factory: "0xFactoryETH",
      blockExplorer: "https://etherscan.io",
    },
  },
  {
    id: 56,
    name: "BSC",
    logo: "/chain/bsc.png",
    color: "bg-yellow-500",
    contracts: {
      lendingPool: "0xEtlPoolBSC",
      factory: "0xFactoryBSC",
      blockExplorer: "https://bscscan.com",
    },
  },
  {
    id: 137,
    name: "Polygon",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-purple-600",
    contracts: {
      lendingPool: "0xEtlPoolPolygon",
      factory: "0xFactoryPolygon",
      blockExplorer: "https://polygonscan.com",
    },
  },
  {
    id: 43114,
    name: "Avalanche",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-red-500",
    contracts: {
      lendingPool: "0xEtlPoolAvalanche",
      factory: "0xFactoryAvalanche",
      blockExplorer: "https://snowtrace.io",
    },
  },
  {
    id: 250,
    name: "Fantom",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-blue-400",
    contracts: {
      lendingPool: "0xEtlPoolFantom",
      factory: "0xFactoryFantom",
      blockExplorer: "https://ftmscan.com",
    },
  },
  {
    id: 10,
    name: "Optimism",
    logo: "/chain/optimism.png",
    color: "bg-red-600",
    contracts: {
      lendingPool: "0xEtlPoolOptimism",
      factory: "0xFactoryOptimism",
      blockExplorer: "https://optimistic.etherscan.io",
    },
  },
  {
    id: 42161,
    name: "Arbitrum",
    logo: "/chain/arbitrum.png",
    color: "bg-blue-500",
    contracts: {
      lendingPool: "0xEtlPoolArbitrum",
      factory: "0xFactoryArbitrum",
      blockExplorer: "https://arbiscan.io",
    },
  },
  {
    id: 8453,
    name: "Base",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-blue-700",
    contracts: {
      lendingPool: "0xEtlPoolBase",
      factory: "0xFactoryBase",
      blockExplorer: "https://basescan.org",
    },
  },
];

const tokens: Token[] = [
  {
    name: "ETH",
    symbol: "ETH",
    address: "0x0000000000000000000000000000000000000000",
    logo: "/placeholder.svg?height=40&width=40",
    chainIds: [1, 10, 42161, 8453],
  },
  {
    name: "WETH",
    symbol: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    logo: "/weth.png",
    chainIds: [1, 10, 42161, 8453, 137],
  },
  {
    name: "USDT",
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    logo: "/usdt.png",
    chainIds: [1, 56, 137, 43114, 10, 42161],
  },
  {
    name: "USD Coin",
    symbol: "USDC",
    address: "usdc.png",
    logo: "/placeholder.svg?height=40&width=40",
    chainIds: [1, 10, 42161, 8453, 137, 43114],
  },
  {
    name: "DAI Stablecoin",
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    logo: "/placeholder.svg?height=40&width=40",
    chainIds: [1, 137, 10, 42161],
  },
  {
    name: "WBTC",
    symbol: "WBTC",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    logo: "/wbtc.png",
    chainIds: [1, 10, 42161, 137],
  },
];

export default function CrossChainBorrowing() {
  // Collateral state
  const [selectedCollateralChain, setSelectedCollateralChain] =
    useState<Chain | null>(null);
  const [selectedCollateralToken, setSelectedCollateralToken] =
    useState<Token | null>(null);
  const [isCollateralDialogOpen, setIsCollateralDialogOpen] = useState(false);

  // Borrow state
  const [selectedBorrowChain, setSelectedBorrowChain] = useState<Chain | null>(
    null
  );
  const [selectedBorrowToken, setSelectedBorrowToken] = useState<Token | null>(
    null
  );
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Add borrow amount state at the top with other states
  const [borrowAmount, setBorrowAmount] = useState("");

  const TokenChainSelector = ({
    selectedChain,
    selectedToken,
    onChainSelect,
    onTokenSelect,
    placeholder,
    isOpen,
    onOpenChange,
    title,
  }: {
    selectedChain: Chain | null;
    selectedToken: Token | null;
    onChainSelect: (chain: Chain) => void;
    onTokenSelect: (token: Token) => void;
    placeholder: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
  }) => {
    const [internalSelectedChain, setInternalSelectedChain] =
      useState<Chain | null>(selectedChain);

    const filteredTokens = tokens.filter((token) => {
      const matchesSearch =
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesChain = internalSelectedChain
        ? token.chainIds.includes(internalSelectedChain.id)
        : true;
      return matchesSearch && matchesChain;
    });

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 h-16 bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
          >
            {selectedChain && selectedToken ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image
                    src={selectedToken.logo || "/placeholder.svg"}
                    alt={selectedToken.symbol}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <Image
                    src={selectedChain.logo || "/placeholder.svg"}
                    alt={selectedChain.name}
                    width={18}
                    height={18}
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full `}
                  />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {selectedToken.symbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    {selectedChain.name}
                  </div>
                </div>
              </div>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md bg-gray-900 border-gray-700 text-white p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-800"
                onClick={() => onOpenChange(false)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <DialogTitle className="text-lg font-semibold">
                {title}
              </DialogTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800 border-gray-600 hover:bg-gray-700"
            >
              <Wallet className="h-4 w-4 mr-2" />
              Connect wallet
            </Button>
          </div>

          {/* Chain Selection */}
          <div className="p-4">
            <div className="grid grid-cols-5 gap-3 mb-4">
              {chains.map((chain) => (
                <button
                  key={chain.id}
                  className={`relative p-3 rounded-xl transition-all ${
                    internalSelectedChain?.id === chain.id
                      ? "bg-blue-600 ring-2 ring-blue-400"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                  onClick={() => {
                    setInternalSelectedChain(chain);
                    setSearchTerm("");
                  }}
                >
                  <Image
                    src={chain.logo || "/placeholder.svg"}
                    alt={chain.name}
                    width={32}
                    height={32}
                    className="rounded-full mx-auto"
                  />
                  {chains.indexOf(chain) >= 8 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-xl">
                      <span className="text-sm font-medium">
                        +{chains.length - 8}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by token name or address"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 h-12"
              />
            </div>

            {/* Token List */}
            <ScrollArea className="h-80">
              <div className="space-y-2">
                {filteredTokens.map((token) => (
                  <button
                    key={`${token.symbol}-${
                      internalSelectedChain?.id || "all"
                    }`}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      onTokenSelect(token);
                      if (internalSelectedChain) {
                        onChainSelect(internalSelectedChain);
                      }
                      onOpenChange(false);
                    }}
                  >
                    <Image
                      src={token.logo || "/placeholder.svg"}
                      alt={token.symbol}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-white">
                        {token.symbol}
                      </div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen mt-16">
      <div className="max-w-2xl mx-auto">

        {/* Borrowing Interface */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Borrow Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Choose Collateral
                </label>
                <TokenChainSelector
                  selectedChain={selectedCollateralChain}
                  selectedToken={selectedCollateralToken}
                  onChainSelect={setSelectedCollateralChain}
                  onTokenSelect={setSelectedCollateralToken}
                  placeholder="Select collateral asset"
                  isOpen={isCollateralDialogOpen}
                  onOpenChange={setIsCollateralDialogOpen}
                  title="Exchange from"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Choose Asset to Borrow
                </label>
                <TokenChainSelector
                  selectedChain={selectedBorrowChain}
                  selectedToken={selectedBorrowToken}
                  onChainSelect={setSelectedBorrowChain}
                  onTokenSelect={setSelectedBorrowToken}
                  placeholder="Select asset to borrow"
                  isOpen={isBorrowDialogOpen}
                  onOpenChange={setIsBorrowDialogOpen}
                  title="Exchange from"
                />
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Borrow Amount
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  placeholder="0.00"
                  className="h-12 text-lg bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-20"
                />
                {selectedBorrowToken && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {selectedBorrowToken.symbol}
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
              disabled={
                !selectedCollateralToken ||
                !selectedBorrowToken ||
                !borrowAmount
              }
            >
              Continue to Borrow
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

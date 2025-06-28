"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { chains } from "@/constants/chain-address";
import { tokens } from "@/constants/token-address";
import type { Chain, Token } from "@/types/type";

type Props = {
  selectedChain: Chain | null;
  selectedToken: Token | null;
  onChainSelect: (chain: Chain) => void;
  onTokenSelect: (token: Token) => void;
  placeholder: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
};

export function TokenChainSelector({
  selectedChain,
  selectedToken,
  onChainSelect,
  onTokenSelect,
  placeholder,
  isOpen,
  onOpenChange,
  title,
}: Props) {
  const [internalSelectedChain, setInternalSelectedChain] = useState<Chain | null>(selectedChain);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesChain = internalSelectedChain
      ? Object.hasOwn(token.addresses, internalSelectedChain.id)
      : true;

    return matchesSearch && matchesChain;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-16 bg-white border-gray-300 hover:bg-gray-100 text-black"
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
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full"
                />
              </div>
              <div className="text-left">
                <div className="font-semibold">{selectedToken.symbol}</div>
                <div className="text-sm text-gray-500">{selectedChain.name}</div>
              </div>
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white border-gray-300 text-black p-0">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-1 hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-5 gap-3 mb-4">
            {chains.map((chain) => (
              <button
                key={chain.id}
                className={`relative p-3 rounded-xl transition-all ${
                  internalSelectedChain?.id === chain.id
                    ? "bg-blue-100 ring-2 ring-blue-400"
                    : "bg-gray-100 hover:bg-gray-200"
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
              </button>
            ))}
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by token name or address"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-gray-300 text-black placeholder-gray-500 h-12"
            />
          </div>

          <ScrollArea className="h-80">
            <div className="space-y-2">
              {filteredTokens.map((token) => (
                <button
                  key={`${token.symbol}-${internalSelectedChain?.id || "all"}`}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
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
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-sm text-gray-500">{token.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

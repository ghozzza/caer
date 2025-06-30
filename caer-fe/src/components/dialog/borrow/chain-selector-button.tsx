"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowRightLeft, ChevronDown } from "lucide-react";
import type { Chain } from "@/types/type";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { chains } from "@/constants/chain-address";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  fromChain: number;
  toChain: number;
  setFromChain: (chain: number) => void;
  setToChain: (chain: number) => void;
}

export default function ChainSelectorButton({
  fromChain,
  toChain,
  setFromChain,
  setToChain,
}: Props) {
  const [isChainSelectorOpen, setIsChainSelectorOpen] = useState(false);
  const [activeSelectorType, setActiveSelectorType] = useState<"from" | "to">(
    "to"
  );

  const fromChainDetail = chains.find((chain) => chain.id === fromChain);
  const toChainDetail = chains.find((chain) => chain.id === toChain);

  const handleSwapChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
  };

  const handleOpenChainSelector = (type: "from" | "to") => {
    setActiveSelectorType(type);
    setIsChainSelectorOpen(true);
  };

  const handleChainSelect = (chain: string) => {
    if (activeSelectorType === "from") {
      setFromChain(Number(chain));
    } else {
      setToChain(Number(chain));
    }
    setIsChainSelectorOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-7 items-center justify-between gap-2">
        <div className="w-full col-span-3">
          <p className="text-sm text-gray-600 mb-">From</p>
          <div className="w-full flex items-center rounded-lg p-3 bg-white border border-gray-200">
            <Image
              src={fromChainDetail?.logo || "/placeholder.svg"}
              alt={fromChainDetail?.name || "Chain"}
              width={24}
              height={24}
              className="mr-2 rounded-full"
            />
            <span className="font-medium truncate">
              {fromChainDetail?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div
            className="bg-gray-100 p-2 mt-6 rounded-full transition-colors flex items-center justify-center"
            onClick={handleSwapChains}
            aria-label="Swap chains"
          >
            <ArrowRight className="size-5 text-gray-600" />
          </div>
        </div>
        <div className="w-full col-span-3">
          <p className="text-sm text-gray-600">To</p>
          <Select
            onValueChange={handleChainSelect}
            defaultValue={toChain.toString()}
          >
            <SelectTrigger className="py-6 border border-gray-200 cursor-pointer min-w-full">
              <SelectValue placeholder="Select a chain">
                {toChainDetail && (
                  <div className="flex items-center">
                    <Image
                      src={toChainDetail.logo || "/placeholder.svg"}
                      alt={toChainDetail.name}
                      width={24}
                      height={24}
                      className="mr-2 rounded-full"
                    />
                    <span className="font-medium truncate">
                      {toChainDetail.name}
                    </span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {chains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id.toString()}>
                  <div className="flex items-center">
                    <Image
                      src={chain.logo || "/placeholder.svg"}
                      alt={chain.name}
                      width={24}
                      height={24}
                      className="mr-2 rounded-full"
                    />
                    <span className="font-medium">{chain.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Dialog open={isChainSelectorOpen} onOpenChange={setIsChainSelectorOpen}>
        <DialogContent className="p-0 max-w-md">
          <DialogTitle className="sr-only">
            Select Destination Chain
          </DialogTitle>
        </DialogContent>
      </Dialog>
    </>
  );
}

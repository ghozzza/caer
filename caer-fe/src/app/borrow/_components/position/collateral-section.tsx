"use client";

import { CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleDollarSign } from "lucide-react";
import Image from "next/image";
import React, { useEffect } from "react";
import { getTokenInfo } from "@/lib/tokenUtils";

interface LpData {
  id: string;
  lpAddress: string;
  collateralToken: string;
  borrowToken: string;
}

interface CollateralSectionProps {
  lpAddress: string;
  setLpAddress: (value: string) => void;
  lpData: LpData[];
}

// Default chain ID (ubah jika multi-chain)
const CHAIN_ID = 43113;

const CollateralSection = ({
  lpAddress,
  setLpAddress,
  lpData,
}: CollateralSectionProps) => {

  const handleLpChange = (value: string) => {
    setLpAddress(value);
  };

  return (
    <div className="flex items-center gap-2 py-2">
      <CircleDollarSign className="h-5 w-5 text-blue-600" />
      <CardTitle className="text-xl text-gray-800 w-full">
        <div className="flex items-center gap-1">
          <div>Lending Pool</div>
          <div className="flex items-center gap-2 ml-4">
            <Select value={lpAddress} onValueChange={handleLpChange}>
              <SelectTrigger className="w-full bg-white text-gray-800 border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-emerald-200 rounded-lg shadow-sm cursor-pointer">
                <SelectValue placeholder="Select a collateral token" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-md">
                <SelectGroup>
                  <SelectLabel className="text-gray-700 font-semibold px-3 pt-2">
                    Collateral Token
                  </SelectLabel>
                  {lpData.map((lp) => {
                    const collateral = getTokenInfo(
                      lp.collateralToken,
                      CHAIN_ID
                    );
                    const borrow = getTokenInfo(lp.borrowToken, CHAIN_ID);

                    return (
                      <SelectItem
                        key={lp.id}
                        value={String(lp.lpAddress)}
                        className="cursor-pointer px-3 py-2 text-sm text-gray-800 hover:bg-emerald-50 transition-colors flex items-center gap-2"
                      >
                        <Image
                          src={collateral?.logo ?? "/placeholder.png"}
                          alt={collateral?.name ?? "Unknown"}
                          width={20}
                          height={20}
                        />
                        {collateral?.name ?? "Unknown"} -
                        <Image
                          src={borrow?.logo ?? "/placeholder.png"}
                          alt={borrow?.name ?? "Unknown"}
                          width={20}
                          height={20}
                        />
                        {borrow?.name ?? "Unknown"}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardTitle>
    </div>
  );
};

export default CollateralSection;

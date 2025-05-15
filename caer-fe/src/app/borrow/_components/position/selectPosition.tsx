"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect } from "react";

const SelectPosition = ({
  positionAddress,
  setPositionAddress,
  setPositionLength,
  setPositionsArray,
  positionArray,
  positionIndex,
  setPositionIndex,
}: {
  positionAddress: string | undefined;
  setPositionAddress: (address: string) => void;
  setPositionLength: (length: number) => void;
  setPositionsArray: (positions: `0x${string}`[]) => void;
  positionArray: any[];
  positionIndex: number | undefined;
  setPositionIndex: (index: number) => void;
}) => {
  useEffect(() => {
    if (positionArray.length > 0 && positionAddress) {
      setPositionIndex(
        positionArray.find(
          (position) => position.positionAddress === positionAddress
        ).positionIndex
      );
    }
  }, [positionAddress]);

  useEffect(() => {
    setPositionAddress("");
  }, [positionArray]);

  return (
    <div>
      <Select
        value={positionAddress}
        onValueChange={(value) => setPositionAddress(value)}
      >
         <SelectTrigger className="w-full bg-white text-gray-800 border border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-emerald-200 rounded-lg shadow-sm cursor-pointer">
          <SelectValue placeholder="Select a position address" />
        </SelectTrigger> 
        <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-md">
          <SelectGroup>
            <SelectLabel className="text-gray-700 font-semibold px-3 pt-2">
              Positions Address
            </SelectLabel>
            {(() => {
              if (positionArray.length > 0) {
                return positionArray.map((position, index) => (
                  <SelectItem
                    className="cursor-pointer px-3 py-2 text-sm text-gray-800 hover:bg-emerald-50 transition-colors"
                    key={index}
                    value={position.positionAddress}
                  >
                    {position.positionAddress}
                  </SelectItem>
                ));
              }
              return (
                <div className="text-gray-600 px-3 py-2 text-sm">
                  No positions found
                </div>
              );
            })()}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectPosition;

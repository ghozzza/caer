"use client";

import React from "react";
import DialogSupply from "./dialog-supply";
import DialogWithdraw from "./dialog-withdraw";
import Image from "next/image";
import { getTokenInfo } from "@/lib/tokenUtils";
import { useReadSupplyLiquidity } from "@/hooks/read/useReadSupplyLiquidity";

interface RowTableProps {
  lpAddress: string;
  borrowToken: string;
  collateralToken: string;
}

// Target chain ID for Avalanche Fuji
const TARGET_CHAIN_ID = 43113;

const RowTable = ({
  lpAddress,
  borrowToken,
  collateralToken,
}: RowTableProps) => {
  const tokenData = getTokenInfo(borrowToken, TARGET_CHAIN_ID);
  const collateralData = getTokenInfo(collateralToken, TARGET_CHAIN_ID);

  const { supplyLiquidity } = useReadSupplyLiquidity({
    tokenAddress: borrowToken,
    chainId: TARGET_CHAIN_ID,
  });

  const handleSupplySuccess = () => {};
  const handleWithdrawSuccess = () => {};

  if (!tokenData) {
    console.warn(
      `Token with address ${borrowToken} not found for chain ${TARGET_CHAIN_ID}`
    );
    return null;
  }

  return (
    <tr className="border-b border-[#9EC6F3]">
      <td className="px-4 text-left">
        <div className="flex items-center justify-center space-x-1">
          <Image
            src={tokenData.logo}
            alt={tokenData.name}
            width={100}
            height={100}
            className="w-7 h-7 rounded-full"
          />
          <div className="font-medium text-gray-700">${tokenData.name}</div>
        </div>
      </td>

      <td className="p-4 text-gray-500">
        <div className="font-medium max-w-[300px] truncate">
          {supplyLiquidity} ${tokenData.name}
        </div>
      </td>

      <td className="p-4">
        <div className="flex items-center gap-3 text-gray-400">
          <Image
            src={collateralData?.logo ?? "/placeholder.svg"}
            alt={collateralData?.name ?? "Unknown"}
            width={100}
            height={100}
            className="w-7 h-7 rounded-full"
          />
          <div>${collateralData?.name ?? "Unknown"}</div>
        </div>
      </td>

      <td className="p-4 text-left">
        <div className="font-medium text-green-500">5.62%</div>
      </td>

      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <DialogSupply
            borrowToken={borrowToken}
            onSuccess={handleSupplySuccess}
          />
          <DialogWithdraw
            lpAddress={lpAddress}
            onSuccess={handleWithdrawSuccess}
          />
        </div>
      </td>
    </tr>
  );
};

export default RowTable;

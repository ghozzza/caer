import React, { useEffect, useState } from "react";
import DialogSupply from "./DialogSupply";
import DialogWithdraw from "./DialogWithdraw";
import Image from "next/image";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { readLendingData } from "@/hooks/read/useReadLendingData";

interface RowTableProps {
  lpAddress: string;
  borrowToken: string;
  collateralToken: string;
}

const RowTable = (props: RowTableProps) => {
  const [liquidity, setLiquidity] = useState<number | string>("0.00");
  const getTokenName = (address: string) => {
    return TOKEN_OPTIONS.find((token) => token?.address === address)?.name;
  };

  const fetchLiquidity = async (lpAddress: string) => {
    const data = await readLendingData(lpAddress as `0x${string}`);
    let liquidityValue;
    if (typeof data.message === "string") {
      liquidityValue = data.message;
    } else {
      liquidityValue = Number(data.message) !== 0 ? Number(data.message) / 1e6 : "0.00";
    }
    setLiquidity(liquidityValue);
  };

  useEffect(() => {
    fetchLiquidity(props.lpAddress);
  }, []);

  const handleSupplySuccess = () => {
    fetchLiquidity(props.lpAddress);
  };

  const handleWithdrawSuccess = () => {
    fetchLiquidity(props.lpAddress);
  };

  return (
    <tr className="border-b border-[#9EC6F3]">
      <td className="px-4 text-left">
        <div className="flex items-center justify-center space-x-1">
          <div>
            <Image
              src={
                TOKEN_OPTIONS.find(
                  (token) => token?.address === props.borrowToken
                )?.logo ?? "/placeholder.svg"
              }
              alt={String(getTokenName(props.borrowToken))}
              width={100}
              height={100}
              className="w-7 h-7 rounded-full"
            />
          </div>
          <div>
            <div className="font-medium text-gray-700">
              ${getTokenName(props.borrowToken)}
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-gray-500">
        <div>
          <div className="font-medium max-w-[300px]">
            <p className="truncate">
              {typeof liquidity === "string" ? liquidity : `${liquidity} $${getTokenName(props.borrowToken)}`}
            </p>
          </div>
        </div>
      </td>

      <td className="p-4">
        <div className="flex items-center space-x-1 text-gray-400 gap-3">
          <div>
            <Image
              src={
                TOKEN_OPTIONS.find(
                  (token) => token?.address === props.collateralToken
                )?.logo ?? "/placeholder.svg"
              }
              alt={String(getTokenName(props.collateralToken))}
              width={100}
              height={100}
              className="w-7 h-7 rounded-full"
            />
          </div>
          <div>${getTokenName(props.collateralToken)}</div>
        </div>
      </td>
      <td className="p-4 text-left">
        <div className="font-medium text-green-500">5.62%</div>
      </td>
      <td className="p-4 text-center flex justify-center">
        <div className="flex items-center gap-2">
          <div>
            {props.lpAddress && props.borrowToken && (
              <DialogSupply
                lpAddress={props.lpAddress}
                borrowToken={props.borrowToken}
                onSuccess={handleSupplySuccess}
              />
            )}
          </div>
          <div>
            <DialogWithdraw
              lpAddress={props.lpAddress}
              onSuccess={handleWithdrawSuccess}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

export default RowTable;

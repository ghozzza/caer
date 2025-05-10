import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { readLendingData } from "@/hooks/read/useReadLendingData";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface RowPoolProps {
  collateralToken: string;
  borrowToken: string;
  ltv: string;
  lpAddress: string;
  rate: string;
  borrowAddress: string;
  handleRowClick: (pool: {
    collateralToken: string;
    loanToken: string;
    ltv: string;
    liquidity: string;
    rate: string;
    lpAddress: string;
    borrowAddress: string;
  }) => void;
}
const RowPool = ({
  collateralToken,
  borrowToken,
  ltv,
  lpAddress,
  rate,
  borrowAddress,
  handleRowClick,
}: RowPoolProps) => {
  const [liquidity, setLiquidity] = useState<string>("0.00");
  const tokenDecimal = TOKEN_OPTIONS.find((token) => token.address === borrowToken)?.decimals;
  const fetchLiquidity = async (lpAddress: string) => {
    const data = await readLendingData(lpAddress as `0x${string}`);
    setLiquidity(
      String(Number(data.message) !== 0 ? Number(data.message) / (10 ** Number(tokenDecimal)) : "0.00")
    );
  };
  useEffect(() => {
    fetchLiquidity(lpAddress);
  }, []);
  const getTokenName = (address: string) => {
    const token = TOKEN_OPTIONS.find((token) => token.address === address);
    return token?.name;
  };

  const getTokenLogo = (address: string) => {
    const token = TOKEN_OPTIONS.find((token) => token.address === address);
    return token?.logo;
  };

  const convertLtv = (ltv: string) => {
    const ltvNumber = Number(ltv) / 1e16;
    return ltvNumber;
  };
  return (
    <button
      className="w-full px-6 py-4 bg-white hover:bg-gray-50 transition-colors cursor-pointer text-left"
      onClick={() =>
        liquidity !== "0.00"
          ? handleRowClick({
              collateralToken: getTokenName(collateralToken ?? "") ?? "",
              loanToken: getTokenName(borrowToken ?? "") ?? "",
              ltv: convertLtv(ltv).toString(),
              liquidity: liquidity,
              rate: rate,
              lpAddress: lpAddress,
              borrowAddress: borrowAddress,
            })
          : toast.error("There is no liquidity in this pool")
      }
    >
      <div className="grid grid-cols-5 gap-4 items-center justify-center text-center">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Image
              src={getTokenLogo(collateralToken ?? "") ?? "/placeholder.png"}
              alt={getTokenName(collateralToken ?? "") ?? ""}
              width={24}
              height={24}
            />
          </div>
          <div className="font-medium text-gray-900">
            {getTokenName(collateralToken ?? "")}
          </div>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
            <Image
              src={getTokenLogo(borrowToken ?? "") ?? "/placeholder.png"}
              alt={getTokenName(borrowToken ?? "") ?? ""}
              width={24}
              height={24}
            />
          </div>
          <div className="font-medium text-gray-900">
            {getTokenName(borrowToken ?? "")}
          </div>
        </div>
        <div className="text-emerald-600">{convertLtv(ltv)}%</div>
        <div className="text-gray-900">
          {liquidity} ${getTokenName(borrowToken ?? "")}
        </div>
        <div className="text-blue-600">3%</div>
      </div>
    </button>
  );
};

export default RowPool;

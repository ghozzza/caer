import { Button } from "@/components/ui/button";
import Link from "next/link";
import { erc20Abi, type Address } from "viem";
import { useReadContract } from "wagmi";
import { RepaySelectedToken } from "./repay-selected-token";
import { tokens } from "@/constants/token-address";
import { ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import { mockUsdc } from "@/constants/addresses";
import { useReadUserCollateral } from "@/hooks/read/useReadUserCollateral";
import { useReadPositionBalance } from "@/hooks/read/useReadPositionBalance";
import { useReadBorrowToken } from "@/hooks/read/useReadBorrowToken";
import { useReadCollateralToken } from "@/hooks/read/useReadCollateralToken";

interface PositionTokenProps {
  name: string | undefined;
  address: Address;
  decimal: number;
  addressPosition: Address | undefined;
  lpAddress: string | undefined;
  logo: string | undefined;
}

const PositionToken = ({
  name,
  address,
  decimal,
  addressPosition,
  lpAddress,
  logo,
}: PositionTokenProps) => {
  const { positionBalance, isLoadingPositionBalance, refetchPositionBalance } =
    useReadPositionBalance(address, addressPosition as Address);

  const { borrowToken } = useReadBorrowToken(lpAddress as `0x${string}`);
  const { collateralToken } = useReadCollateralToken(
    lpAddress as `0x${string}`
  );

  const borrowTokenName = tokens.find(
    (token) => token.addresses[43113] === borrowToken
  )?.name;

  const collateralTokenName = tokens.find(
    (token) => token.addresses[43113] === collateralToken
  )?.name;

  const convertRealAmount = (amount: bigint | undefined, decimal: number) => {
    const realAmount = amount ? Number(amount) / 10 ** decimal : 0;
    return realAmount;
  };

  const getDecimal = (address: Address) => {
    const token = tokens.find((asset) => asset.addresses === address);
    return token?.decimals;
  };

  const tokenBalance = convertRealAmount(
    positionBalance as bigint,
    decimal
  ).toFixed(5);

  const findLogoToken = (address: Address) => {
    const token = tokens.find((asset) => asset.addresses === address);
    return token?.logo;
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-3 items-center hover:bg-emerald-100 transition-colors rounded-lg">
      <div className="flex items-center gap-2 pl-2">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
          <Image
            src={logo as string}
            alt={name as string}
            width={32}
            height={32}
          />
        </div>
        <span className="font-medium text-gray-800">${name}</span>
      </div>

      <div className="text-center">
        <span className="text-gray-800 font-medium">{tokenBalance}</span>
      </div>

      <div className="flex justify-center gap-2">
        <Link href="/trade">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 rounded-lg cursor-pointer">
            <ArrowRightLeft className="size-4 mr-2" />
            Trade
          </Button>
        </Link>

        <div className="text-black">
          {lpAddress && (
            <RepaySelectedToken
              lpAddress={lpAddress}
              addressPosition={addressPosition as Address}
              tokenBalance={tokenBalance}
              borrowToken={borrowTokenName}
              tokenName={name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PositionToken;

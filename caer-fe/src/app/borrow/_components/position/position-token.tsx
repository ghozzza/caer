import { Button } from "@/components/ui/button";
import { positionAbi } from "@/lib/abi/positionAbi";
import Link from "next/link";
import { erc20Abi, type Address } from "viem";
import { useReadContract } from "wagmi";
import { RepaySelectedToken } from "./repay-selected-token";
import { TOKEN_OPTIONS } from "@/constants/tokenOption";
import { ArrowRightLeft } from "lucide-react";
import { useReadLendingData } from "@/hooks/read/useReadLendingData";
import Image from "next/image";
import { mockUsdc } from "@/constants/addresses";

interface PositionTokenProps {
  name: string | undefined;
  address: Address;
  decimal: number;
  addressPosition: Address | undefined;
  arrayLocation: bigint;
  lpAddress: Address | undefined;
}

const PositionToken = ({
  name,
  address,
  decimal,
  addressPosition,
  arrayLocation,
  lpAddress
}: PositionTokenProps) => {
  const { dynamicUserCollateral, dynamicCollateralAddress } = useReadLendingData(
    undefined,
    undefined,
    lpAddress as Address
  );

  const { data: tokenBalanceUSDC } = useReadContract({
    address: mockUsdc,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [addressPosition as Address],
  });

  const convertRealAmount = (amount: bigint | undefined, decimal: number) => {
    const realAmount = amount ? Number(amount) / decimal : 0;
    return realAmount;
  };

  const getDecimal = (address: Address) => {
    const token = TOKEN_OPTIONS.find((asset) => asset.address === address);
    return token?.decimals;
  };

  const tokenBalance =
    dynamicCollateralAddress === address
      ? convertRealAmount(dynamicUserCollateral as bigint, decimal).toFixed(5)
      : convertRealAmount(tokenBalanceUSDC as bigint, decimal).toFixed(2);

  const findLogoToken = (address: Address) => {
    const token = TOKEN_OPTIONS.find((asset) => asset.address === address);
    return token?.logo;
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-3 items-center hover:bg-emerald-100 transition-colors rounded-lg">
      <div className="flex items-center gap-2 pl-2">
        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
          <Image
            src={findLogoToken(address) as string}
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
          <Button className="bg-emerald-500 hover:bg-emerald-600 cursor-pointer">
            <ArrowRightLeft className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Trade</span>
          </Button>
        </Link>

        <div className="text-black">
          <RepaySelectedToken
            name={name}
            balance={tokenBalance}
            address={address}
            decimal={getDecimal(address)}
            arrayLocation={arrayLocation}
            lpAddress={lpAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default PositionToken;

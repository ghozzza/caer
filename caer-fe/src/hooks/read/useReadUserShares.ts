import { chains } from "@/constants/chain-address";
import { tokens } from "@/constants/token-address";
import { poolAbi } from "@/lib/abis/poolAbi";
import { formatUnits } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { useEffect } from "react";

export const useReadUserShares = (lpAddress?: string) => {
  const { address, chainId } = useAccount();
  const currentChain = chains.find((c) => c.id === chainId);

  const usdcToken = tokens.find((t) => t.symbol === "USDC");
  const usdcAddress = usdcToken?.addresses[chainId ?? 43113];
  const usdcDecimals = usdcToken?.decimals ?? 6;

  const {
    data: userSupplySharesAmount,
    isLoading: sharesLoading,
    error: sharesError,
    refetch,
  } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "userSupplyShares",
    args: [address as `0x${string}`],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  const userSupplySharesAmountParsed =
    userSupplySharesAmount != null
      ? parseFloat(formatUnits(userSupplySharesAmount, usdcDecimals))
      : 0;

  return {
    userSupplySharesAmount,
    userSupplySharesAmountParsed,
    sharesLoading,
    sharesError,
    usdcAddress,
  };
};

import { chains } from "@/constants/chain-address";
import { tokens } from "@/constants/token-address";
import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { useAccount, useReadContract } from "wagmi";
import { useEffect } from "react";

export const useReadUserCollateral = () => {
  const { address, chainId } = useAccount();
  const currentChain = chains.find((c) => c.id === chainId);
  const lendingPoolAddress = currentChain?.contracts.lendingPool;

  const wethToken = tokens.find((t) => t.symbol === "WETH");
  const wethAddress = wethToken?.addresses[chainId ?? 43113]; // fallback ke 43113 kalau belum konek

  const {
    data: userPostitionAddress,
    isLoading: positionLoading,
    error: positionError,
    refetch: refetchPosition,
  } = useReadContract({
    address: lendingPoolAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "addressPositions",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!lendingPoolAddress,
    },
  });

  const {
    data: userCollateral,
    isLoading: collateralLoading,
    error: collateralError,
    refetch: refetchCollateral,
  } = useReadContract({
    address: wethAddress as `0x${string}`,
    abi: mockErc20Abi,
    functionName: "balanceOf",
    args: [userPostitionAddress as `0x${string}`],
    query: {
      enabled: !!userPostitionAddress && !!wethAddress,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetchPosition();
      refetchCollateral();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetchPosition, refetchCollateral]);

  return {
    userPostitionAddress,
    userCollateral,
    positionLoading,
    collateralLoading,
    positionError,
    collateralError,
    lendingPoolAddress,
    wethAddress,
    wethToken,
  };
};

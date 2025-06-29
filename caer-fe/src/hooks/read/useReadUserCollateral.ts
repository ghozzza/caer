import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { useAccount, useReadContract } from "wagmi";
import { useEffect } from "react";

export const useReadUserCollateral = (collateralToken: string, lpAddress: string) => {
  const { address } = useAccount();

  const {
    data: userPostitionAddress,
    isLoading: positionLoading,
    error: positionError,
    refetch: refetchPosition,
  } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "addressPositions",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address && !!lpAddress && !!collateralToken,
    },
  });

  const {
    data: userCollateral,
    isLoading: collateralLoading,
    error: collateralError,
    refetch: refetchCollateral,
  } = useReadContract({
    address: collateralToken as `0x${string}`,
    abi: mockErc20Abi,
    functionName: "balanceOf",
    args: [userPostitionAddress as `0x${string}`],
    query: {
      enabled: !!userPostitionAddress && !!collateralToken && !!lpAddress,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetchPosition();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetchPosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetchCollateral();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetchCollateral]);

  return {
    userPostitionAddress,
    userCollateral,
    positionLoading,
    collateralLoading,
    positionError,
    collateralError,
  };
};

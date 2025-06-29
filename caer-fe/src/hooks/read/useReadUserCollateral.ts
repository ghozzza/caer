import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { useAccount, useReadContract } from "wagmi";

export const useReadUserCollateral = (collateralToken: string, lpAddress: string) => {
  const { address } = useAccount();

  const {
    data: userPostitionAddress,
    isLoading: positionLoading,
    error: positionError,
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
  } = useReadContract({
    address: collateralToken as `0x${string}`,
    abi: mockErc20Abi,
    functionName: "balanceOf",
    args: [userPostitionAddress as `0x${string}`],
    query: {
      enabled: !!userPostitionAddress && !!collateralToken && !!lpAddress,
    },
  });

  return {
    userPostitionAddress,
    userCollateral,
    positionLoading,
    collateralLoading,
    positionError,
    collateralError,
  };
};

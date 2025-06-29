import { useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";

export const useReadCollateralToken = (lpAddress: string) => {
  const { data: collateralToken } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "collateralToken",
  });

  return {
    collateralToken,
  };
};
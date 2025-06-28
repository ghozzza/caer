import { useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";

export const useReadTotalBorrowAssets = (lpAddress: string) => {
  const { data: totalBorrowAssets, isLoading: isLoadingTotalBorrowAssets, refetch: refetchTotalBorrowAssets } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "totalBorrowAssets",
  });

  return {
    totalBorrowAssets,
    isLoadingTotalBorrowAssets,
    refetchTotalBorrowAssets,
  }
}
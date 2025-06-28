import { useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";

export const useReadTotalBorrowShares = (lpAddress: string) => {
  const { data: totalBorrowShares, isLoading: isLoadingTotalBorrowShares, refetch: refetchTotalBorrowShares } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "totalBorrowShares",
  });

  return {
    totalBorrowShares,
    isLoadingTotalBorrowShares,
    refetchTotalBorrowShares,
  }
}
import { useAccount, useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";

export const useReadUserBorrowShares = (lpAddress: string) => {
  const { address } = useAccount();

   const { data: userBorrowShares, isLoading: isLoadingUserBorrowShares, refetch: refetchUserBorrowShares } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "userBorrowShares",
    args: [address as `0x${string}`],
   });

   return {
    userBorrowShares,
    refetchUserBorrowShares,
    isLoadingUserBorrowShares,
   }
}
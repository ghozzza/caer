import { useAccount, useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { useEffect } from "react";

export const useReadUserBorrowShares = (lpAddress: string) => {
  const { address } = useAccount();

   const { data: userBorrowShares, isLoading: isLoadingUserBorrowShares, refetch: refetchUserBorrowShares } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "userBorrowShares",
    args: [address as `0x${string}`],
   });

   useEffect(() => {
    const interval = setInterval(() => {
      refetchUserBorrowShares();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetchUserBorrowShares]);

   return {
    userBorrowShares,
    refetchUserBorrowShares,
    isLoadingUserBorrowShares,
   }
}
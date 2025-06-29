import { useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";

export const useReadBorrowToken = (lpAddress: string) => {
  const { data: borrowToken } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "borrowToken",
  });

  return {
    borrowToken,
  };
};
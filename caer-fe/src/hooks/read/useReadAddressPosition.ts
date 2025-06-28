import { useAccount, useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";

export const useReadAddressPosition = (lpAddress: string) => {
  const { address } = useAccount();

  const {
    data: addressPosition,
    isLoading: isLoadingAddressPosition,
    refetch: refetchAddressPosition,
  } = useReadContract({
    address: lpAddress as `0x${string}`,
    abi: poolAbi,
    functionName: "addressPositions",
    args: [address as `0x${string}`],
  });

  return {
    addressPosition,
    isLoadingAddressPosition,
    refetchAddressPosition,
  };
};

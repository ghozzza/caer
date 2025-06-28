import { useReadContract } from "wagmi";
import { mockErc20Abi } from "@/lib/abis/mockErc20Abi";

export const useReadPositionBalance = (collateralToken: string, addressPosition: string) => {
  const { data: positionBalance, isLoading: isLoadingPositionBalance, refetch: refetchPositionBalance } = useReadContract({
    address: collateralToken as `0x${string}`,
    abi: mockErc20Abi,
    functionName: "balanceOf",
    args: [addressPosition as `0x${string}`],
  });

  return {
    positionBalance,
    isLoadingPositionBalance,
    refetchPositionBalance,
  };
};
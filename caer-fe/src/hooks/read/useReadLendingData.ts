import { useAccount, useReadContract } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { Address } from "viem";
import { chains } from "@/constants/chain-address";
import { publicClient } from "@/lib/viem";
import { use } from "react";

const lendingPool = chains[1].contracts.lendingPool as `0x${string}`;

export const useReadLendingData = (
  userAddress?: Address,
  tokenAddress?: Address,
  lpAddress?: `0x${string}`
) => {
  const { address } = useAccount();

  const { data: checkAvailability, refetch: refetchCheckAvailability } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "addressPositions",
    args: [address as `0x${string}`],
  });

  const { data: borrowAddress, refetch: refetchBorrowAddress } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "borrowToken",
  });

  const { data: collateralAddress, refetch: refetchCollateralAddress } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "collateralToken",
  });

  const { data: dynamicCollateralAddress, refetch: refetchDynamicCollateralAddress } = useReadContract({
    address: lpAddress,
    abi: poolAbi,
    functionName: "collateralToken",
  });

  const { data: totalSupplyAssets, refetch: refetchTotalSupplyAssets } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyAssets",
    args: [],
  });

  const { data: dynamicTotalSupplyAssets, refetch: refetchDynamicTotalSupplyAssets } = useReadContract({
    address: lpAddress,
    abi: poolAbi,
    functionName: "totalSupplyAssets",
    args: [],
  });

  const { data: totalBorrowAssets, refetch: refetchTotalBorrowAssets } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalBorrowAssets",
    args: [],
  });

  const { data: totalBorrowShares, refetch: refetchTotalBorrowShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalBorrowShares",
    args: [],
  });

  const { data: totalSupplyShares, refetch: refetchTotalSupplyShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalSupplyShares",
    args: [],
  });

  // const { data: userCollateral, refetch: refetchUserCollateral } = useReadContract({
  //   address: lendingPool,
  //   abi: poolAbi,
  //   functionName: "userCollaterals",
  //   args: [address],
  // });

  // const { data: userSupply, refetch: refetchUserSupply } = useReadContract({
  //   address: lendingPool,
  //   abi: poolAbi,
  //   functionName: "userSupplyShares",
  //   args: [address],
  // });

  // const { data: userBorrow, refetch: refetchUserBorrow } = useReadContract({
  //   address: lendingPool,
  //   abi: poolAbi,
  //   functionName: "userBorrowShares",
  //   args: [address],
  // });

  // const { data: dynamicUserBorrow, refetch: refetchDynamicUserBorrow } = useReadContract({
  //   address: lpAddress,
  //   abi: poolAbi,
  //   functionName: "userBorrowShares",
  //   args: [address],
  // });

  // const { data: dynamicUserCollateral, refetch: refetchDynamicUserCollateral } = useReadContract({
  //   address: lpAddress,
  //   abi: poolAbi,
  //   functionName: "userCollaterals",
  //   args: [address],
  // });

  const { data: dynamicTotalBorrowAssets, refetch: refetchDynamicTotalBorrowAssets } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalBorrowAssets",
    args: [],
  });

  const { data: dynamicTotalBorrowShares, refetch: refetchDynamicTotalBorrowShares } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "totalBorrowShares",
    args: [],
  });
  

  const refetchAll = async () => {
    await Promise.all([
      refetchCheckAvailability(),
      refetchBorrowAddress(),
      refetchCollateralAddress(),
      refetchTotalSupplyAssets(),
      refetchDynamicTotalSupplyAssets(),
      // refetchTokenBalanceByPosition(),
      refetchTotalBorrowAssets(),
      refetchTotalBorrowShares(),
      refetchTotalSupplyShares(),
      // refetchUserCollateral(),
      // refetchUserSupply(),
      // refetchUserBorrow(),
      // refetchDynamicUserBorrow(),
      // refetchDynamicUserCollateral(),
      refetchDynamicCollateralAddress(),
      refetchDynamicTotalBorrowAssets(),
      refetchDynamicTotalBorrowShares(),
    ]);
  };
  
  return {
    checkAvailability,
    totalSupplyAssets,
    totalSupplyShares,
    collateralAddress,
    borrowAddress,
    // userCollateral,
    // tokenBalanceByPosition,
    totalBorrowAssets,
    totalBorrowShares,
    // userSupply,
    // userBorrow,
    // dynamicTotalSupplyAssets: dynamicTotalSupplyAssets
    //   ? Number(dynamicTotalSupplyAssets)
    //   : "0.00",
    // dynamicUserBorrow,
    // dynamicUserCollateral,
    dynamicCollateralAddress,
    dynamicTotalBorrowAssets,
    dynamicTotalBorrowShares,
    refetchAll,
  };
};

export const readLendingData = async (lpAddress: `0x${string}`) => {
  let totalSupplyAssets: BigInt;
  try {
    totalSupplyAssets = (await publicClient.readContract({
      address: lpAddress,
      abi: poolAbi,
      functionName: "totalSupplyAssets",
      args: [],
    })) as BigInt;
  } catch (error) {
    console.error("Error reading totalSupplyAssets:", error);
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        return { 
          success: false, 
          message: "Network error: Unable to connect to the RPC endpoint. Please check your internet connection and try again." 
        };
      }
      return { 
        success: false, 
        message: `Contract call failed: ${error.message}` 
      };
    }
    return { 
      success: false, 
      message: "An unexpected error occurred while reading contract data" 
    };
  }
  return { success: true, message: totalSupplyAssets };
};

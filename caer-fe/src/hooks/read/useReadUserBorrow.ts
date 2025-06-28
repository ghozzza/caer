import { useReadContract } from "wagmi";

 
 
 const { data: borrowAddress, refetch: refetchBorrowAddress } = useReadContract({
    address: lendingPool,
    abi: poolAbi,
    functionName: "borrowToken",
  });
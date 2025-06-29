"use server";

import { PrismaClient } from "@prisma/client";
import { createPublicClient } from "viem";
import { http } from "wagmi";
import { poolAbi } from "@/lib/abis/poolAbi";
import { avalancheFuji } from "viem/chains";
const prisma = new PrismaClient();

const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
});

const chain_id = avalancheFuji.id;

export const createPosition = async (
  collateralToken: string,
  borrowToken: string,
  poolIndex: string,
  lpAddress: string,
  owner: string
) => {
  const positionCount = await prisma.position.count({
    where: {
      owner: owner,
      lpAddress: lpAddress,
      chain_id: chain_id.toString(),
    },
  });

  const positionIndex = positionCount !== 0 ? positionCount : 0;
  let positionAddress;
  try {
    positionAddress = await publicClient.readContract({
      address: lpAddress as `0x${string}`,
      abi: poolAbi,
      functionName: "addressPositions",
      args: [owner as `0x${string}`],
    });
  } catch (error) {
    console.error("Error creating position:", error);
  }


  const position = await prisma.position.create({
    data: {
      collateralToken: collateralToken,
      borrowToken: borrowToken,
      poolIndex: poolIndex,
      positionIndex: String(positionIndex),
      lpAddress: lpAddress,
      positionAddress: positionAddress as `0x${string}`,
      owner: owner,
      chain_id: chain_id.toString(),
    },
  });

  if (!position) {
    return {
      success: false,
      message: "Position creation failed",
    };
  }
  return {
    success: true,
    message: "Position created successfully",
  };
};

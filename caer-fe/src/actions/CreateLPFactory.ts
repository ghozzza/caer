"use server";

import { PrismaClient } from "@prisma/client";
import { factoryAbi } from "@/lib/abis/factoryAbi";
import { publicClient } from "@/lib/viem";
import { chains } from "@/constants/chain-address";

const prisma = new PrismaClient();

export const createLPFactory = async (
  _sender: string,
  _collateralToken: string,
  _borrowToken: string,
  _ltv: string,
  chainId: number
) => {
  const sender = _sender;
  const collateralToken = _collateralToken;
  const borrowToken = _borrowToken;
  const ltv = _ltv;


  const chain = chains.find((c) => c.id === chainId);
  if (!chain) {
    return { success: false, message: "Invalid chain ID" };
  }

  const factoryAddress = chain.contracts.factory;

  // Check if pool already exists
  const existingPool = await prisma.lP_Factory.findFirst({
    where: {
      collateralToken,
      borrowToken,
      chain_id: chainId.toString(),
    },
  });

  const latestPool = await prisma.lP_Factory.findFirst({
    orderBy: {
      poolIndex: "desc",
    },
    where: {
      chain_id: chainId.toString(),
    },
  });

  if (existingPool) {
    return {
      success: false,
      message: "Pool already exists for this configuration",
    };
  }

  let poolAddress: [string, string, string];
  let poolCount: bigint;

  try {
    poolCount = (await publicClient.readContract({
      address: factoryAddress as `0x${string}`,
      abi: factoryAbi,
      functionName: "poolCount",
    })) as bigint;

    poolAddress = (await publicClient.readContract({
      address: factoryAddress as `0x${string}`,
      abi: factoryAbi,
      functionName: "pools",
      args: [poolCount === BigInt(0) ? poolCount : poolCount - BigInt(1)],
    })) as [string, string, string];
  } catch (error) {
    console.error("Error reading pool address:", error);
    return { success: false, message: "Failed to read pool address" };
  }

  if (!poolAddress) {
    return { success: false, message: "Failed to fetch pool address" };
  }

  if (latestPool?.poolIndex === String(poolCount)) {
    return { success: false, message: "Duplicate pool index detected" };
  }

  try {
    await prisma.lP_Factory.create({
      data: {
        sender,
        collateralToken: poolAddress[0],
        borrowToken: poolAddress[1],
        lpAddress: poolAddress[2],
        ltv,
        poolIndex: String(poolCount),
        chain_id: chainId.toString(),
      },
    });

    return { success: true, message: "LP Factory created successfully" };
  } catch (err) {
    console.error("Error saving pool to DB:", err);
    return { success: false, message: "Failed to save to database" };
  }
};

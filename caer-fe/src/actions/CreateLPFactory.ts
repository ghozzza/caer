"use server";
import { chain_id, factory } from "@/constants/addresses";
import { factoryAbi } from "@/lib/abi/factoryAbi";
import { publicClient } from "@/lib/viem";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createLPFactory = async (
  _sender: string,
  _collateralToken: string,
  _borrowToken: string,
  _ltv: string
) => {
  const sender = _sender;
  const collateralToken = _collateralToken;
  const borrowToken = _borrowToken;
  const ltv = _ltv;

  // Check if pool already exists for this sender
  const existingPool = await prisma.lP_Factory.findFirst({
    where: {
      collateralToken: collateralToken,
      borrowToken: borrowToken,
      chain_id: chain_id.toString(),
    },
  });

  const latestPool = await prisma.lP_Factory.findFirst({
    orderBy: {
      poolIndex: "desc",
    },
    where: {
      chain_id: chain_id.toString(),
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
      address: factory,
      abi: factoryAbi,
      functionName: "poolCount",
    })) as bigint;
    console.log("poolCount", poolCount);
    poolAddress = (await publicClient.readContract({
      address: factory,
      abi: factoryAbi,
      functionName: "pools",
      args: [Number(poolCount) == 0 ? poolCount : Number(poolCount) - 1],
    })) as [string, string, string];
  } catch (error) {
    console.error("Error reading pool address:", error);
    return { success: false, message: "Failed to read pool address" };
  }
  if (!poolAddress) {
    return { success: false, message: "Failed to read pool address" };
  }
  if (collateralToken && borrowToken) {
    // Create LP Factory record with placeholder address
    console.log("poolAddress", poolAddress);
    console.log("latestPool", latestPool);
    // check poolcount === poolindex in latest db
    if (latestPool?.poolIndex == String(Number(poolCount))) {
      return { success: false, message: "Failed to create LP Factory" };
    }
    await prisma.lP_Factory.create({
      data: {
        sender: sender,
        collateralToken: poolAddress[0],
        borrowToken: poolAddress[1],
        lpAddress: poolAddress[2],
        ltv: ltv,
        poolIndex: String(poolCount),
        chain_id: chain_id.toString(),
      },
    });
    return { success: true, message: "LP Factory created successfully" };
  }
  return { success: false, message: "Failed to create LP Factory" };
};

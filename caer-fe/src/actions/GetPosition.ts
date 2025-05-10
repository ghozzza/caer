"use server";

import { chain_id } from "@/constants/addresses";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPositionByOwnerAndLpAddress = async (address: string, lpAddress: string) => {
  const position = await prisma.position.findMany({
    where: { owner: address, lpAddress: lpAddress, chain_id: chain_id.toString() },
  });
  return {
    success: true,
    data: position,
  };
};

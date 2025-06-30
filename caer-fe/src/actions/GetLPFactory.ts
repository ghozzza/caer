"use server";

import { chains } from "@/constants/chain-address";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const chain_id = chains.find((c) => c.id === 43113)?.id || 43113;

export const getAllLPFactoryData = async () => {
  const data = await prisma.lP_Factory.findMany({
    where: {
      chain_id: chain_id.toString(),
    },
  });
  return data;
};
export const getSelectedLPFactory = async (address: string) => {
  if (address) {
    const data = await prisma.lP_Factory.findFirst({
      where: {
        sender: address,
        chain_id: chain_id.toString(),
      },
    });
    return data;
  } else {
    return null;
  }
};
export const getLPFactoryCount = async () => {
  const count = await prisma.lP_Factory.count({
    where: {
      chain_id: chain_id.toString(),
    },
  });
  return count;
};

export const getSelectedLPFactorybyColBor = async (
  collateralToken: string,
  borrowToken: string
) => {
  const data = await prisma.lP_Factory.findFirst({
    where: {
      collateralToken: collateralToken,
      borrowToken: borrowToken,
      chain_id: chain_id.toString(),
    },
  });
  return data;
};

export const getSelectedLPFactoryByAddress = async (address: string) => {
  const data = await prisma.lP_Factory.findFirst({
    where: {
      lpAddress: address,
      chain_id: chain_id.toString(),
    },
  });
  return data;
};

export const getSelectedCollateralTokenByLPAddress = async (address: string) => {
  const data = await prisma.lP_Factory.findFirst({
    where: {
      lpAddress: address,
    },
  });
  return data;
};

"use client";

import { useReadContract } from "wagmi";
import { Address } from "viem";
import { priceAbi } from "@/lib/abis/price-abi";
import { priceFeed } from "@/constants/addresses";
import { tokens } from "@/constants/token-address"; // gunakan konstanta tokens

const CURRENT_CHAIN_ID = 43113;

export const useTokenPrice = (
  fromTokenAddress: Address,
  toTokenAddress: Address
) => {
  const {
    data: price,
    isLoading,
    error,
  } = useReadContract({
    address: priceFeed,
    abi: priceAbi,
    functionName: "getPrice",
    args: [fromTokenAddress, toTokenAddress],
  });

  // Temukan token yang cocok berdasarkan address di chain 43113
  const token = tokens.find(
    (t) => t.addresses[CURRENT_CHAIN_ID] === toTokenAddress
  );

  const formattedPrice = price
    ? Number(price) / 10 ** (token?.decimals ?? 18)
    : 0;

  return {
    price: formattedPrice,
    isLoading,
    error,
    rawPrice: price,
  };
};

export const usePriceTrade = (
  fromTokenAddress: Address,
  toTokenAddress: Address
) => {
  const { data, isLoading, error } = useReadContract({
    address: priceFeed,
    abi: priceAbi,
    functionName: "getPriceTrade",
    args: [fromTokenAddress, toTokenAddress],
  });

  const fromToken = tokens.find(
    (t) => t.addresses[CURRENT_CHAIN_ID] === fromTokenAddress
  );
  const toToken = tokens.find(
    (t) => t.addresses[CURRENT_CHAIN_ID] === toTokenAddress
  );

  const fromPrice =
    data && Array.isArray(data)
      ? Number(data[0]) / 10 ** (fromToken?.decimals ?? 18)
      : 0;

  const toPrice =
    data && Array.isArray(data)
      ? Number(data[1]) / 10 ** (toToken?.decimals ?? 18)
      : 0;

  return {
    fromPrice,
    toPrice,
    isLoading,
    error,
    rawData: data,
  };
};

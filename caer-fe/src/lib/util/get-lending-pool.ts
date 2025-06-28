import { chains } from "@/constants/chain-address";
import { Address } from "viem";

export const getLendingPoolAddress = (chainId: number) => {
  const chain = chains.find((c) => c.id === chainId);
  return chain?.contracts.lendingPool as Address;
};

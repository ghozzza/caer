import { Token } from "@/types/type";
import { tokens } from "@/constants/token-address";

export const getTokensByChain = (chainId: number): Token[] => {
  return tokens.filter((token) => token.addresses[chainId]);
};

import { tokens } from "@/constants/token-address";

export function getTokenInfo(tokenAddress: string, chainId: number) {
  return tokens.find((token) => {
    const addr = token.addresses[chainId];
    return addr?.toLowerCase() === tokenAddress.toLowerCase();
  }) ?? null;
}

export function getTokenDecimals(tokenAddress: string, chainId: number): number | null {
  return getTokenInfo(tokenAddress, chainId)?.decimals ?? null;
}

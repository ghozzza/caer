import { createPublicClient } from "viem";
import { http } from "wagmi";
import { avalancheFuji } from "viem/chains";

export const publicClient = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
});

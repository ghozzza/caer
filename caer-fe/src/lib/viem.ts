import { createPublicClient } from "viem";
import { http } from "wagmi";
import { pharosChain } from "./data/chain-data";
import { arbitrumSepolia, optimismSepolia } from "viem/chains";
import { chain_id } from "../constants/addresses";
export const ArbPublicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

export const publicClient = createPublicClient({
  chain: chain_id === 50002 ? pharosChain : optimismSepolia,
  transport: http(),
});

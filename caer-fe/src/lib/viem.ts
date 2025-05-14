import { createPublicClient } from "viem";
import { http } from "wagmi";
import { pharosChain, baseMainnet } from "./data/chain-data";
import { arbitrumSepolia } from "viem/chains";
import { chain_id } from "../constants/addresses";
export const ArbPublicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

console.log(process.env.BASE_RPC_URL);

export const publicClient = createPublicClient({
  chain: chain_id === 50002 ? pharosChain : baseMainnet,
  transport: http(),  
});

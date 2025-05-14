import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { pharosChain, baseMainnet } from "./data/chain-data";
import { chain_id } from "@/constants/addresses";

export const config = getDefaultConfig({
  appName: "MyDApp",
  projectId: "YOUR_PROJECT_ID",
  chains: [chain_id === 50002 ? pharosChain : baseMainnet],
  transports: {
    [chain_id === 50002 ? pharosChain.id : baseMainnet.id]: http(),
  },
});

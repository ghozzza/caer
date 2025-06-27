import { http } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { avalancheFuji } from "viem/chains";

export const config = getDefaultConfig({
  appName: "MyDApp",
  projectId: "YOUR_PROJECT_ID",
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http(),
  },
});

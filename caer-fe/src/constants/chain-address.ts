import { Chain } from "@/types/type";

export const chains: Chain[] = [
  {
    id: 11155111,
    name: "Ethereum",
    logo: "/chain/ethereum.png",
    color: "bg-yellow-500",
    destination: 0,
    contracts: {
      lendingPool: "",
      factory: "",
      position: "",
      blockExplorer: "https://sepolia.etherscan.io",
    },
  },

  {
    id: 43113,
    name: "Avalanche Fuji",
    logo: "/chain/avax-logo.png",
    color: "bg-blue-600",
    destination: 1,
    contracts: {
      lendingPool: "0x9108c9d911846e925b24Bc9a1d8Abbf965212957",
      factory: "0xf8BaFD421BF510a492059F98e1a61F22793eb540",
      position: "0x1506485c87F06366b5c8148a18019f9EF11373B2",
      blockExplorer: "https://testnet.snowtrace.io",
    },
  },

  {
    id: 421614,
    name: "Arbitrum",
    logo: "/chain/arbitrum.png",
    color: "bg-purple-600",
    destination: 2,
    contracts: {
      lendingPool: "",
      factory: "",
      position: "",
      blockExplorer: "https://sepolia.arbiscan.io",
    },
  },
  {
    id: 84532,
    name: "Base",
    logo: "/chain/base.png",
    color: "bg-red-500",
    destination: 3,
    contracts: {
      lendingPool: "",
      factory: "",
      position: "",
      blockExplorer: "https://sepolia.basescan.org",
    },
  },
];

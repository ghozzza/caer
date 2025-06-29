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
      lendingPool: "0xe10e79324c133DA09426972c9401b503a7b48186",
      factory: "0x694B5A70f83062308aa60ecf12074Bc8f694612d",
      position: "0x9ee9F9158b872fe812C3F2204588dfc8b0FC4Eda",
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

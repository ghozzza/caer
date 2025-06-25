import { Chain } from "@/types/type";

export const chains: Chain[] = [
  {
    id: 56,
    name: "Ethereum",
    logo: "/chain/bsc.png",
    color: "bg-yellow-500",
    destination: 0,
    contracts: {
      lendingPool: "0xEtlPoolBSC",
      factory: "0xFactoryBSC",
      position: "0xPositionBSC",
      blockExplorer: "https:",
    },
  },

  {
    id: 43113,
    name: "Avalanche Fuji",
    logo: "/chain/arbitrum.png",
    color: "bg-blue-600",
    destination: 1,
    contracts: {
      lendingPool: "0x5d863542d39F1A6937F212Efa1678E7609b71156",
      factory: "0x9eF28B341CAD6D916d13325D85E803e245d88fB5",
      position: "0x1506485c87F06366b5c8148a18019f9EF11373B2",
      blockExplorer: "testnet.snowtrace.io",
    },
  },

  {
    id: 137,
    name: "Arbitrum",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-purple-600",
    destination: 2,
    contracts: {
      lendingPool: "0xEtlPoolPolygon",
      factory: "0xFactoryPolygon",
      position: "0xPositionPolygon",
      blockExplorer: "https://polygonscan.com",
    },
  },
  {
    id: 43114,
    name: "Base",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-red-500",
    destination: 3,
    contracts: {
      lendingPool: "0xEtlPoolAvalanche",
      factory: "0xFactoryAvalanche",
      position: "0xPositionAvalanche",
      blockExplorer: "https://snowtrace.io",
    },
  },
];

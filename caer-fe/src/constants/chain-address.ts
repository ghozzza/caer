import {Chain} from "@/types/type";

export const chains: Chain[] = [
  {
    id: 1,
    name: "Ethereum",
    logo: "/chain/arbitrum.png",
    color: "bg-blue-600",
    contracts: {
      lendingPool: "0xEtlPoolETH",
      factory: "0xFactoryETH",
      blockExplorer: "https://etherscan.io",
    },
  },
  {
    id: 56,
    name: "BSC",
    logo: "/chain/bsc.png",
    color: "bg-yellow-500",
    contracts: {
      lendingPool: "0xEtlPoolBSC",
      factory: "0xFactoryBSC",
      blockExplorer: "https://bscscan.com",
    },
  },
  {
    id: 137,
    name: "Polygon",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-purple-600",
    contracts: {
      lendingPool: "0xEtlPoolPolygon",
      factory: "0xFactoryPolygon",
      blockExplorer: "https://polygonscan.com",
    },
  },
  {
    id: 43114,
    name: "Avalanche",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-red-500",
    contracts: {
      lendingPool: "0xEtlPoolAvalanche",
      factory: "0xFactoryAvalanche",
      blockExplorer: "https://snowtrace.io",
    },
  },
  {
    id: 250,
    name: "Fantom",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-blue-400",
    contracts: {
      lendingPool: "0xEtlPoolFantom",
      factory: "0xFactoryFantom",
      blockExplorer: "https://ftmscan.com",
    },
  },
  {
    id: 10,
    name: "Optimism",
    logo: "/chain/optimism.png",
    color: "bg-red-600",
    contracts: {
      lendingPool: "0xEtlPoolOptimism",
      factory: "0xFactoryOptimism",
      blockExplorer: "https://optimistic.etherscan.io",
    },
  },
  {
    id: 42161,
    name: "Arbitrum",
    logo: "/chain/arbitrum.png",
    color: "bg-blue-500",
    contracts: {
      lendingPool: "0xEtlPoolArbitrum",
      factory: "0xFactoryArbitrum",
      blockExplorer: "https://arbiscan.io",
    },
  },
  {
    id: 8453,
    name: "Base",
    logo: "/placeholder.svg?height=40&width=40",
    color: "bg-blue-700",
    contracts: {
      lendingPool: "0xEtlPoolBase",
      factory: "0xFactoryBase",
      blockExplorer: "https://basescan.org",
    },
  },
];
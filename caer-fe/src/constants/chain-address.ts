import { Chain } from "@/types/type";

export const chains: Chain[] = [
  {
    id: 11155111,
    name: "Ethereum",
    logo: "/chain/ethereum.png",
    color: "bg-yellow-500",
    destination: 0,
    contracts: {
      lendingPool: "0xEtlPoolBSC",
      factory: "0xFactoryBSC",
      position: "0xPositionBSC",
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
      lendingPool: "0x024F057D80a37416D4997f1Da2dA1Bf07cb9980E",
      factory: "0xf38E89B07eBFAe0fC59647D198Dd077267E8CA7E",
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
      lendingPool: "0xEtlPoolPolygon",
      factory: "0xFactoryPolygon",
      position: "0xPositionPolygon",
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
      lendingPool: "0xEtlPoolAvalanche",
      factory: "0xFactoryAvalanche",
      position: "0xPositionAvalanche",
      blockExplorer: "https://sepolia.basescan.org",
    },
  },
];

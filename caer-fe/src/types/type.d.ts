import { Address } from "viem";

interface SupplyDialogProps {
  poolId: number;
  token: string;
  apy: string;
}

interface AssetItem {
  id: string;
  name: string;
  network: string;
  icon: string;
  available: number;
  apy: number;
  borrowed?: number;
}

interface PositionTokenProps {
  name: string | undefined;
  address: Address;
  decimal: number;
  addressPosition: Address | undefined;
}

export interface ChainSelectorProps {
  onSelect: (chain: Chain) => void;
  onClose: () => void;
  selectorType: "from" | "to";
}

export interface SwapTokenParams {
  fromToken: {
    address: string;
    name: string;
    decimals: number;
  };
  toToken: {
    address: string;
    name: string;
    decimals: number;
  };
  fromAmount: string;
  toAmount: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface CreatePositionsResponse {
  createPositions: Array<{
    id: string;
    user: string;
    blockNumber: string;
    positionAddress: string;
  }>;
}
export interface Chain {
  id: number;
  name: string;
  logo: string;
  color: string;
  destination: number;
  contracts: {
    lendingPool: string;
    factory: string;
    position: string;
    blockExplorer: string;
  };
}

export interface DestinationChain {
  id: number;
  name: string;
  logo: string;
  destination: number;
}

export interface Token {
  name: string;
  symbol: string;
  logo: string;
  decimals: number;
  addresses: {
    [chainId: number]: Address;
  };
  priceFeed: Address;
}

interface TransactionHandlerProps {
  amount: string;
  token: string;
  fromChain: any;
  toChain: any;
  recipientAddress: string;
  lpAddress: string;
  onSuccess: () => void;
  onLoading: (loading: boolean) => void;
}
interface BorrowingDialogProps {
  token?: string;
}
 interface TokenOption {
  name: string;
  namePrice: string;
  address: string;
  logo: string;
  decimals: number;
}
export {
  SupplyDialogProps,
  AssetItem,
  TransactionHandlerProps,
  PositionTokenProps,
  BorrowingDialogProps,
  TokenOption,
};

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
      selectedAddress?: string;
      chainId?: string;
    };
  }
}

export {};

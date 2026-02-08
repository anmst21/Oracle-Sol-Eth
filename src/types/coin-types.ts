export type RelayToken = {
  chainId?: number;
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  vmType?: "bvm" | "evm" | "svm" | "tvm" | "tonvm" | "suivm" | "hypevm";
  metadata?: {
    logoURI?: string;
    verified?: boolean;
    isNative?: boolean;
  };
};

export type UnifiedToken = {
  name: string;
  chainId?: number;
  address: string;
  symbol: string;
  logo?: string;
  priceUsd?: number;
  priceNative?: number;
  balance?: number;
  source: "relay" | "eth" | "sol" | "community" | "gecko" | "solTrending";
  decimals?: number;
};

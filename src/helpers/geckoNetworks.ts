export type GeckoNetwork = {
  id: string;
  numId: number;
  img: string;
  dex: {
    id: string;
    type: string;
    attributes: {
      name: string;
    };
  };
  type: string;
  attributes: {
    name: string;
    coingecko_asset_platform_id: string;
  };
};

export const geckoNetworks: GeckoNetwork[] = [
  {
    numId: 8453,
    id: "base",
    img: "https://assets.relay.link/icons/square/8453/light.png",
    dex: {
      id: "uniswap-v3-base",
      type: "dex",
      attributes: {
        name: "Uniswap V3 (Base)",
      },
    },
    type: "network",
    attributes: {
      name: "Base",
      coingecko_asset_platform_id: "base",
    },
  },
  {
    numId: 792703809,
    id: "solana",
    img: "https://assets.relay.link/icons/square/792703809/light.png",
    dex: {
      id: "raydium",
      type: "dex",
      attributes: {
        name: "Raydium",
      },
    },
    type: "network",
    attributes: {
      name: "Solana",
      coingecko_asset_platform_id: "solana",
    },
  },
  {
    id: "arbitrum",
    numId: 42161,
    img: "https://assets.relay.link/icons/square/42161/light.png",
    type: "network",
    dex: {
      id: "uniswap_v3_arbitrum",
      type: "dex",
      attributes: {
        name: "Uniswap V3 (Arbitrum)",
      },
    },
    attributes: {
      name: "Arbitrum",
      coingecko_asset_platform_id: "arbitrum-one",
    },
  },

  {
    id: "eth",
    numId: 1,
    img: "https://assets.relay.link/icons/square/1/light.png",

    dex: {
      id: "uniswap_v3",
      type: "dex",
      attributes: {
        name: "Uniswap V3",
      },
    },
    type: "network",
    attributes: {
      name: "Ethereum",
      coingecko_asset_platform_id: "ethereum",
    },
  },
  {
    numId: 10,
    id: "optimism",
    img: "https://assets.relay.link/icons/square/10/light.png",
    type: "network",
    dex: {
      id: "uniswap_v3_optimism",
      type: "dex",
      attributes: {
        name: "Uniswap V3 (Optimism)",
      },
    },
    attributes: {
      name: "Optimism",
      coingecko_asset_platform_id: "optimistic-ethereum",
    },
  },
  {
    numId: 137,
    id: "polygon_pos",
    img: "https://assets.relay.link/icons/square/137/light.png",
    dex: {
      id: "uniswap_v3_polygon_pos",
      type: "dex",
      attributes: {
        name: "Uniswap V3 (Polygon POS)",
      },
    },
    type: "network",
    attributes: {
      name: "Polygon POS",
      coingecko_asset_platform_id: "polygon-pos",
    },
  },
];

export const restNetworksImg = {
  666666666: "https://assets.relay.link/icons/square/666666666/light.png",
  7777777: "https://assets.relay.link/icons/square/7777777/light.png",
};

export interface Token {
  groupID?: string;
  chainId?: number;
  address?: string;
  symbol?: string;
  name?: string;
  decimals?: number;
  vmType?: "bvm" | "evm" | string; // Adjust union as needed
  metadata?: {
    logoURI?: string;
    verified?: boolean;
    isNative?: boolean;
  };
}

export interface PriceStat {
  price: number;
  date: number;
  _id: string;
}

// Type representing the complete coin object from the API
export interface FetchedCoin {
  _id: string;
  id: string;
  name: string;
  description: string;
  channel: string;
  urls: {
    etherscan: string;
    warpcast: string;
    website: string;
  };
  chain: string;
  chain_id: number;
  poolAddress: string;
  tokenAddress: string;
  imageURL: string;
  createdAt: number;
  stats: {
    base_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_usd: string;
    quote_token_price_native_currency: string;
    base_token_price_quote_token: string;
    quote_token_price_base_token: string;
    address: string;
    name: string;
    pool_created_at: string;
    token_price_usd: string;
    fdv_usd: string;
    market_cap_usd: string;
    price_change_percentage: {
      m5: string;
      h1: string;
      h6: string;
      h24: string;
    };
    transactions: {
      m5: { buys: number; sells: number; buyers: number; sellers: number };
      m15: { buys: number; sells: number; buyers: number; sellers: number };
      m30: { buys: number; sells: number; buyers: number; sellers: number };
      h1: { buys: number; sells: number; buyers: number; sellers: number };
      h24: { buys: number; sells: number; buyers: number; sellers: number };
    };
    volume_usd: {
      m5: string;
      h1: string;
      h6: string;
      h24: string;
    };
    reserve_in_usd: string;
    total_reserve_in_usd: string;
    total_h24_volume_in_usd: string;
  };
  watchlistCount: number;
  channelStats: Array<{
    followerCount: number;
    date: number;
    _id: string;
  }>;
  volumeStats: Array<{
    volume_usd: string;
    date: number;
    _id: string;
  }>;
  priceStats: Array<{
    price: string;
    date: number;
    _id: string;
  }>;
  holdersStats: Array<{
    count: number;
    date: number;
    _id: string;
  }>;
}

// The formatted coin type with proper priceStats
export interface FormattedCoin {
  address: string;
  chainId: number;
  symbol: string;
  metadata: {
    logoURI: string;
  };
  priceStats: PriceStat[];
  stats: {
    fdv: number;
    token_price_usd: number;
    price_change_percentage: {
      h24: number;
    };
  };
}

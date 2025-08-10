export interface PriceChangePercentage {
  m5: string;
  m15: string;
  m30: string;
  h1: string;
  h6: string;
  h24: string;
}

// Represents one timeframe’s buy/sell counts, e.g. { buys: 41, sells: 36, buyers: 25, sellers: 19 }
export interface TransactionStats {
  buys: number;
  sells: number;
  buyers: number;
  sellers: number;
}

// Groups TransactionStats under each timeframe, e.g. { m5: TransactionStats, m15: TransactionStats, … }
export interface Transactions {
  m5: TransactionStats;
  m15: TransactionStats;
  m30: TransactionStats;
  h1: TransactionStats;
  h6: TransactionStats;
  h24: TransactionStats;
}

// Represents the “volume_usd” object where each timeframe maps to a string amount
export interface VolumeUSD {
  m5: string;
  m15: string;
  m30: string;
  h1: string;
  h6: string;
  h24: string;
}

// The “attributes” block on each pool item
export interface PoolAttributes {
  name: string;
  address: string;
  base_token_price_usd: string;
  quote_token_price_usd: string;
  base_token_price_native_currency: string;
  quote_token_price_native_currency: string;
  base_token_price_quote_token: string;
  quote_token_price_base_token: string;
  pool_created_at: string; // ISO timestamp
  reserve_in_usd: string;
  token_price_usd: string;

  fdv_usd: string;
  market_cap_usd: string;
  price_change_percentage: PriceChangePercentage;
  transactions: Transactions;
  volume_usd: VolumeUSD;
}

// A single relationship entry, e.g. { data: { id: "base_0x…", type: "token" } }
export interface RelationshipData {
  id: string;
  type: string;
}

// Groups any named relationship (e.g. “base_token”, “quote_token”, “dex”) under one object
export type Relationships = Record<string, { data: RelationshipData }>;

// One “pool” item in the top‐level “data” array
export interface PoolItem {
  id: string;
  type: string; // e.g. "pool"
  attributes: PoolAttributes;
  relationships: Relationships;
}

// The overall response shape
export interface PoolResponse {
  data: PoolItem[];
}

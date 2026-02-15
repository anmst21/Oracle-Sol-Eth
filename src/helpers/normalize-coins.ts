import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { FetchedCoin } from "@/types/CommunityCoins";
import { PoolItem } from "@/types/token-pools";

const emptyTxn = { buys: 0, sells: 0, buyers: 0, sellers: 0 };

export function normalizeSolanaCoins(data: DexScreenerTokenMeta[]): PoolItem[] {
  return data.map((coin) => ({
    id: coin.pairAddress,
    type: "pool",
    attributes: {
      name: `${coin.baseToken.symbol} / ${coin.quoteToken.symbol}`,
      address: coin.pairAddress,
      base_token_price_usd: coin.priceUsd ?? "0",
      quote_token_price_usd: "0",
      base_token_price_native_currency: coin.priceNative ?? "0",
      quote_token_price_native_currency: "0",
      base_token_price_quote_token: "0",
      quote_token_price_base_token: "0",
      pool_created_at: new Date(coin.pairCreatedAt).toISOString(),
      reserve_in_usd: String(coin.liquidity?.usd ?? 0),
      token_price_usd: coin.priceUsd ?? "0",
      fdv_usd: String(coin.fdv ?? 0),
      market_cap_usd: String(coin.marketCap ?? 0),
      price_change_percentage: {
        m5: String(coin.priceChange?.m5 ?? 0),
        m15: "0",
        m30: "0",
        h1: String(coin.priceChange?.h1 ?? 0),
        h6: String(coin.priceChange?.h6 ?? 0),
        h24: String(coin.priceChange?.h24 ?? 0),
      },
      transactions: {
        m5: { ...emptyTxn, ...coin.txns?.m5 },
        m15: emptyTxn,
        m30: emptyTxn,
        h1: { ...emptyTxn, ...coin.txns?.h1 },
        h6: { ...emptyTxn, ...coin.txns?.h6 },
        h24: { ...emptyTxn, ...coin.txns?.h24 },
      },
      volume_usd: {
        m5: String(coin.volume?.m5 ?? 0),
        m15: "0",
        m30: "0",
        h1: String(coin.volume?.h1 ?? 0),
        h6: String(coin.volume?.h6 ?? 0),
        h24: String(coin.volume?.h24 ?? 0),
      },
    },
    relationships: {},
  }));
}

export function normalizeEthereumCoins(data: MergedToken[]): PoolItem[] {
  return data.map((coin) => ({
    id: coin.id,
    type: coin.type,
    attributes: {
      ...coin.attributes,
      token_price_usd: coin.attributes.base_token_price_usd,
      market_cap_usd: coin.attributes.market_cap_usd ?? "0",
      price_change_percentage: {
        ...coin.attributes.price_change_percentage,
        m15: "0",
        m30: "0",
      },
      transactions: {
        ...coin.attributes.transactions,
        h6: emptyTxn,
      },
      volume_usd: {
        ...coin.attributes.volume_usd,
        m15: "0",
        m30: "0",
      },
    },
    relationships: coin.relationships as unknown as PoolItem["relationships"],
  }));
}

export function normalizeCommunityCoins(data: FetchedCoin[]): PoolItem[] {
  return data.map((coin) => ({
    id: coin.id,
    type: "pool",
    attributes: {
      name: coin.stats.name,
      address: coin.stats.address,
      base_token_price_usd: coin.stats.base_token_price_usd,
      quote_token_price_usd: coin.stats.quote_token_price_usd,
      base_token_price_native_currency:
        coin.stats.base_token_price_native_currency,
      quote_token_price_native_currency:
        coin.stats.quote_token_price_native_currency,
      base_token_price_quote_token: coin.stats.base_token_price_quote_token,
      quote_token_price_base_token: coin.stats.quote_token_price_base_token,
      pool_created_at: coin.stats.pool_created_at,
      reserve_in_usd: coin.stats.reserve_in_usd,
      token_price_usd: coin.stats.token_price_usd,
      fdv_usd: coin.stats.fdv_usd,
      market_cap_usd: coin.stats.market_cap_usd,
      price_change_percentage: {
        ...coin.stats.price_change_percentage,
        m15: "0",
        m30: "0",
      },
      transactions: {
        ...coin.stats.transactions,
        h6: emptyTxn,
      },
      volume_usd: {
        ...coin.stats.volume_usd,
        m15: "0",
        m30: "0",
      },
    },
    relationships: {},
  }));
}

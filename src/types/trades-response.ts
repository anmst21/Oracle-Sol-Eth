export interface TradeItem {
  id: string;
  type: "trade";
  attributes: TradeAttributes;
}

export interface TradeAttributes {
  block_number: number;
  block_timestamp: string; // ISO 8601 timestamp
  tx_hash: string;
  tx_from_address: string;
  from_token_amount: string; // big‑decimal as string
  to_token_amount: string; // big‑decimal as string
  price_from_in_currency_token: string;
  price_to_in_currency_token: string;
  price_from_in_usd: string;
  price_to_in_usd: string;
  kind: "buy" | "sell";
  volume_in_usd: string;
  from_token_address: string;
  to_token_address: string;
}

export interface TradesResponse {
  data: TradeItem[];
}

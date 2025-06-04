// One OHLCV entry as a tuple: [timestamp, open, high, low, close, volume]
export type OHLCVEntry = [
  number, // Unix timestamp
  number, // open price
  number, // high price
  number, // low price
  number, // close price
  number // volume
];

// The “attributes” block containing the OHLCV list
export interface OHLCVAttributes {
  ohlcv_list: OHLCVEntry[];
}

// The “data” object wrapping id, type, and attributes
export interface OHLCVData {
  id: string;
  type: string; // e.g. "ohlcv_request_response"
  attributes: OHLCVAttributes;
}

// Token info used in the “meta” section for base/quote
export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  coingecko_coin_id: string;
}

// The “meta” object with base and quote token metadata
export interface OHLCVMeta {
  base: TokenInfo;
  quote: TokenInfo;
}

// The overall response shape
export interface OHLCVResponse {
  data: OHLCVData;
  meta: OHLCVMeta;
}

/** Coinbase Onramp API types */

export interface CoinbaseNetwork {
  name: string;
  display_name: string;
  chain_id: string;
  contract_address: string;
}

export interface CoinbasePurchaseCurrency {
  id: string;
  symbol: string;
  name: string;
  icon_url: string;
  networks: CoinbaseNetwork[];
}

export interface CoinbasePaymentCurrency {
  id: string;
  limits: {
    id: string;
    min: string;
    max: string;
  }[];
}

export interface CoinbaseBuyOptionsResponse {
  payment_currencies: CoinbasePaymentCurrency[];
  purchase_currencies: CoinbasePurchaseCurrency[];
}

export interface CoinbaseBuyQuoteResponse {
  payment_total: { value: string; currency: string };
  payment_subtotal: { value: string; currency: string };
  purchase_amount: { value: string; currency: string };
  coinbase_fee: { value: string; currency: string };
  network_fee: { value: string; currency: string };
  quote_id: string;
}

export interface CoinbaseSessionTokenResponse {
  token: string;
  channel_id: string;
}

/** Simplified fiat currency for UI (enriched from static map) */
export interface OnrampFiatCurrency {
  id: string;
  code: string;
  name: string;
  icon: string;
  minBuyAmount: number;
  maxBuyAmount: number;
}

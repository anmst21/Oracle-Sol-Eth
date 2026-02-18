"use server";

import { generateCoinbaseJwt } from "./coinbase-jwt";
import { CoinbaseBuyQuoteResponse } from "@/types/coinbase-onramp";

interface QuoteParams {
  purchaseCurrency: string;
  purchaseNetwork?: string;
  paymentAmount: string;
  paymentCurrency: string;
  country: string;
  paymentMethod?: string;
}

export async function fetchCoinbaseQuote(
  params: QuoteParams
): Promise<CoinbaseBuyQuoteResponse> {
  const path = "/onramp/v1/buy/quote";
  const jwt = await generateCoinbaseJwt("POST", path);

  const body: Record<string, string> = {
    purchase_currency: params.purchaseCurrency,
    payment_amount: params.paymentAmount,
    payment_currency: params.paymentCurrency,
    payment_method: params.paymentMethod ?? "CARD",
    country: params.country,
  };
  if (params.purchaseNetwork) {
    body.purchase_network = params.purchaseNetwork;
  }

  const res = await fetch(`https://api.developer.coinbase.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Coinbase quote error (${res.status}): ${text}`);
  }

  return res.json();
}

"use server";

import { MoonpayBuyQuoteResponse } from "@/types/moonpay-api";

export async function fetchMoonpayBuyQuote({
  currencyCode,
  baseCurrencyCode,
  baseCurrencyAmount,
}: {
  currencyCode: string;
  baseCurrencyCode: string;
  baseCurrencyAmount: string;
}): Promise<MoonpayBuyQuoteResponse> {
  const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY;

  if (!apiKey) {
    throw new Error("MoonPay API key is not configured");
  }

  const params = new URLSearchParams({
    apiKey,
    baseCurrencyCode,
    baseCurrencyAmount,
  });

  const res = await fetch(
    `https://api.moonpay.com/v3/currencies/${encodeURIComponent(
      currencyCode
    )}/buy_quote?${params.toString()}`,
    {
      cache: "no-store",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `MoonPay quote API error ${res.status}: ${text || res.statusText}`
    );
  }

  return (await res.json()) as MoonpayBuyQuoteResponse;
}

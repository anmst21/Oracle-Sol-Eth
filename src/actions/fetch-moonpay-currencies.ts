// actions/fetch-moonpay-currencies.ts
"use server";

import {
  MoonpayCurrenciesSplit,
  MoonpayFiatCurrency,
  MoonpayCryptoCurrency,
} from "@/types/moonpay-api";

export async function fetchMoonpayCurrencies(): Promise<MoonpayCurrenciesSplit> {
  const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY;

  if (!apiKey) {
    throw new Error("MoonPay API key is not configured");
  }

  const res = await fetch(
    `https://api.moonpay.com/v3/currencies?apiKey=${encodeURIComponent(
      apiKey
    )}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `MoonPay currencies API error ${res.status}: ${text || res.statusText}`
    );
  }

  const data = (await res.json()) as (
    | MoonpayFiatCurrency
    | MoonpayCryptoCurrency
  )[];

  const fiat = data.filter((c): c is MoonpayFiatCurrency => c.type === "fiat");
  const crypto = data.filter(
    (c): c is MoonpayCryptoCurrency => c.type === "crypto"
  );

  return { fiat, crypto };
}

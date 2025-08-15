"use server";

import { MoonpayIpResponse } from "@/types/moonpay-api";

export async function fetchMoonpayIp(): Promise<MoonpayIpResponse> {
  const apiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY;
  if (!apiKey) {
    throw new Error("MoonPay API key is missing");
  }

  const res = await fetch(
    `https://api.moonpay.com/v3/ip_address?apiKey=${encodeURIComponent(
      apiKey
    )}`,
    {
      // always fresh
      cache: "no-store",
      // (optional) also disable any ISR caching layers
      next: { revalidate: 0 },
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `MoonPay API error ${res.status}: ${body || res.statusText}`
    );
  }

  const data = (await res.json()) as MoonpayIpResponse;
  return data;
}

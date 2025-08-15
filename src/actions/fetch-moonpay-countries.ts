"use server";

import { MoonpayCountriesResponse } from "@/types/moonpay-api";

export async function fetchMoonpayCountries(): Promise<MoonpayCountriesResponse> {
  const apiKey =
    process.env.NEXT_PUBLIC_MOONPAY_API_KEY ?? process.env.MOONPAY_API_KEY;

  if (!apiKey) {
    throw new Error("MoonPay API key is not configured");
  }

  const res = await fetch(
    `https://api.moonpay.com/v3/countries?apiKey=${encodeURIComponent(apiKey)}`,
    {
      cache: "no-store",
      next: { revalidate: 0 },
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `MoonPay countries API error ${res.status}: ${text || res.statusText}`
    );
  }

  const data = (await res.json()) as MoonpayCountriesResponse;
  return data;
}

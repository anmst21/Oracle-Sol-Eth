"use server";

import { generateCoinbaseJwt } from "./coinbase-jwt";
import { CoinbaseSessionTokenResponse } from "@/types/coinbase-onramp";

interface SessionTokenParams {
  address: string;
  blockchains: string[];
  assets: string[];
}

export async function fetchCoinbaseSessionToken(
  params: SessionTokenParams
): Promise<CoinbaseSessionTokenResponse> {
  const path = "/onramp/v1/token";
  const jwt = await generateCoinbaseJwt("POST", path);

  const body = {
    addresses: [
      {
        address: params.address,
        blockchains: params.blockchains,
      },
    ],
    assets: params.assets,
  };

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
    throw new Error(`Coinbase session token error (${res.status}): ${text}`);
  }

  return res.json();
}

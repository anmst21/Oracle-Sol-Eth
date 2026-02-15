"use server";

import { geckoTerminalBaseUri } from "@/helpers/gecko-terminal-dex-data";
import {
  GeckoTerminalCoins,
  GeckoMeta,
  MergedToken,
} from "@/types/GeckoTerminalCoins";

export async function fetchCoinsPage(
  chain: "eth" | "solana",
  page: number
): Promise<MergedToken[]> {
  const res = await fetch(
    `${geckoTerminalBaseUri}/networks/${chain}/trending_pools?page=${page}&include=base_token,quote_token`,
    {
      headers: { Accept: "application/json;version=20230302" },
      next: { revalidate: 30 },
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP error! Status: ${res.status}`);
  }

  const {
    data,
    included: meta,
  }: { data: GeckoTerminalCoins[]; included: GeckoMeta[] } = await res.json();

  if (!data || data.length === 0) return [];

  return data.map((pool) => {
    const baseTokenId = pool.relationships.base_token.data.id;
    const quoteTokenId = pool.relationships.quote_token.data.id;
    const baseMeta = meta?.find((m) => m.id === baseTokenId);
    const quoteMeta = meta?.find((m) => m.id === quoteTokenId);

    return {
      ...pool,
      meta: { base: baseMeta, quote: quoteMeta },
    };
  });
}

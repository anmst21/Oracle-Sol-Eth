"use server";

import {
  GeckoTerminalCoins,
  GeckoMeta,
  MergedToken,
} from "@/types/GeckoTerminalCoins";

export async function fetchEthereumCoinsRaw(
  chain: string = "eth",
  include: string = "base_token,quote_token"
): Promise<MergedToken[] | null> {
  try {
    const baseUrl = `https://api.geckoterminal.com/api/v2/networks/${chain}/trending_pools`;
    const params = new URLSearchParams({ include });
    const url = `${baseUrl}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json;version=20230302",
      },
      cache: "force-cache",
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const {
      data,
      included: meta,
    }: { data: GeckoTerminalCoins[]; included: GeckoMeta[] } =
      await response.json();

    const mergedData: MergedToken[] = data.map((pool) => {
      const baseTokenId = pool.relationships.base_token.data.id;
      const quoteTokenId = pool.relationships.quote_token.data.id;

      const baseMeta = meta.find((m) => m.id === baseTokenId);
      const quoteMeta = meta.find((m) => m.id === quoteTokenId);

      return {
        ...pool,
        meta: {
          base: baseMeta,
          quote: quoteMeta,
        },
      };
    });

    return mergedData;
  } catch (error) {
    console.error("Error fetching full Ethereum tokens:", error);
    return null;
  }
}

"use server";
import {
  GeckoTerminalCoins,
  GeckoMeta,
  MergedToken,
} from "@/types/GeckoTerminalCoins";

type PoolSearchParams = {
  network: string;
  query: string;
  page?: number;
  include?: string;
};

export async function searchDexTokens({
  network,
  query,
  page = 1,
  include = "base_token,quote_token",
}: PoolSearchParams): Promise<MergedToken[] | null> {
  try {
    const baseUrl = "https://api.geckoterminal.com/api/v2/search/pools";
    const params = new URLSearchParams({
      network,
      query,
      page: page.toString(),
    });

    // Append the include parameter if provided
    if (include) {
      params.append("include", include);
    }

    const url = `${baseUrl}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json;version=20230302",
      },
      cache: "force-cache",
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch pools: ${response.status} ${response.statusText}`
      );
    }

    const {
      data,
      included: meta,
    }: { data: GeckoTerminalCoins[]; included: GeckoMeta[] } =
      await response.json();

    const mergedData = data.map((pool) => {
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
    console.error("Error fetching pools:", error);
    return null;
  }
}

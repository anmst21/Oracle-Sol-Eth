"use server";
import { UnifiedToken } from "@/types/coin-types";
import { GeckoMeta, GeckoTerminalCoins } from "@/types/GeckoTerminalCoins";

export async function fetchTokensForChain(
  chain: string,
  include: string = "base_token,quote_token"
): Promise<UnifiedToken[] | null> {
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
    // console.log("dm", mergedData);
    const uniquePoolsByBaseSymbol = mergedData.filter((pool, index, self) => {
      if (pool.meta.base) {
        const baseSymbol = pool.meta.base.attributes.symbol;
        return (
          index ===
          self.findIndex(
            (p) => p.meta.base && p.meta.base.attributes.symbol === baseSymbol
          )
        );
      }
    });

    const generalized = uniquePoolsByBaseSymbol.map((t) => ({
      source: "gecko" as const,
      chainId: 8453,
      address: t.meta!.base!.attributes.address,
      symbol: t.meta!.base!.attributes.symbol,
      logo: t.meta!.base!.attributes.image_url,
      priceUsd: Number(t.attributes.base_token_price_usd),
      priceNative: Number(t.attributes.base_token_price_native_currency),
      name: t.meta!.base!.attributes.name,
    }));

    return generalized;
  } catch (error) {
    console.error("Error fetching popular tokens from dex:", error);
    return null;
  }
}

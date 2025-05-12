"use server";

import { UnifiedToken } from "@/types/coin-types";
import { FetchedCoin, FormattedCoin } from "@/types/CommunityCoins";

export const fetchCommunityCoins = async (): Promise<UnifiedToken[] | null> => {
  try {
    const response = await fetch("https://www.farcaster.in/api/tokens", {
      cache: "force-cache",
      next: { revalidate: 60 * 60 },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch coins: ${response.statusText}`);
    }
    const data: FetchedCoin[] = await response.json();
    console.log("dddope", data);
    // Format the data before returning
    const formattedData: FormattedCoin[] = data.map((coin) => ({
      address: coin.tokenAddress,
      chainId: coin.chain_id,
      symbol: coin.stats.name.split(" ")[0] || coin.name,
      name: coin.name,
      metadata: {
        logoURI: coin.imageURL,
      },
      priceStats: coin.priceStats.map((stat) => ({
        ...stat,
        price: Number(stat.price),
      })),
      stats: {
        fdv: Number(coin.stats.fdv_usd),
        token_price_usd: Number(coin.stats.token_price_usd),
        token_price_native: Number(
          coin.stats.quote_token_price_native_currency
        ),
        base_token_price_quote_token: Number(
          coin.stats.base_token_price_quote_token
        ),
        price_change_percentage: {
          h24: Number(coin.stats.price_change_percentage.h24),
        },
      },
    }));

    const generalized = formattedData.map((t) => ({
      source: "community" as const,
      chainId: t.chainId,
      address: t.address,
      symbol: t.symbol,
      logo: t.metadata.logoURI,
      priceUsd: t.stats.token_price_usd,
      priceNative: t.stats.base_token_price_quote_token,
      name: t.name,
    }));

    return generalized;
  } catch (error) {
    console.error("Failed to fetch coins:", error);
    return null;
  }
};

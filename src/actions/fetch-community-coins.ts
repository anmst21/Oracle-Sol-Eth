"use server";

import { FetchedCoin, FormattedCoin } from "@/types/CommunityCoins";

export const fetchCommunityCoins = async (): Promise<
  FormattedCoin[] | null
> => {
  try {
    const response = await fetch("https://www.farcaster.in/api/tokens", {
      cache: "force-cache",
      next: { revalidate: 60 * 60 },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch coins: ${response.statusText}`);
    }
    const data: FetchedCoin[] = await response.json();

    // Format the data before returning
    const formattedData: FormattedCoin[] = data.map((coin) => ({
      address: coin.tokenAddress,
      chainId: coin.chain_id,
      symbol: coin.name,
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
        price_change_percentage: {
          h24: Number(coin.stats.price_change_percentage.h24),
        },
      },
    }));

    return formattedData;
  } catch (error) {
    console.error("Failed to fetch coins:", error);
    return null;
  }
};

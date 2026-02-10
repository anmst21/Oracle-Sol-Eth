"use server";

import { DexScreenerToken, DexScreenerTokenMeta } from "@/types/SolanaCoins";

export async function fetchSolanaCoinsRaw(): Promise<
  DexScreenerTokenMeta[] | null
> {
  try {
    const response = await fetch(
      "https://api.dexscreener.com/token-boosts/top/v1",
      { cache: "force-cache", next: { revalidate: 60 * 60 } }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const solanaTokens = data.filter(
      (token: DexScreenerToken) =>
        token.chainId && token.chainId.toLowerCase() === "solana"
    );

    const tokenAddresses = solanaTokens
      .map((token: DexScreenerToken) => token.tokenAddress)
      .join(",");

    const priceResponse = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${tokenAddresses}`,
      { cache: "force-cache", next: { revalidate: 60 * 60 } }
    );

    const metaData: DexScreenerTokenMeta[] = await priceResponse.json();

    return metaData;
  } catch (error) {
    console.error("Error fetching full Solana tokens:", error);
    return null;
  }
}

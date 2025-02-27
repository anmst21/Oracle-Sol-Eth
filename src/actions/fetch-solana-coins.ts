"use server";

import { DexScreenerToken, DexScreenerTokenMeta } from "@/types/SolanaCoins";

export async function fetchSolanaCoins(): Promise<
  DexScreenerTokenMeta[] | null
> {
  try {
    const response = await fetch(
      "https://api.dexscreener.com/token-boosts/top/v1"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    // Filter tokens to only include those on the Solana chain
    const solanaTokens = data.filter(
      (token: DexScreenerToken) =>
        token.chainId && token.chainId.toLowerCase() === "solana"
    );

    const tokenAddresses = solanaTokens
      .map((token: DexScreenerToken) => token.tokenAddress)
      .join(",");

    const priceResponse = await fetch(
      `https://api.dexscreener.com/tokens/v1/solana/${tokenAddresses}`
    );

    const metaData: DexScreenerTokenMeta[] = await priceResponse.json();

    return metaData;
  } catch (error) {
    console.error("Error fetching popular tokens:", error);
    return null;
  }
}

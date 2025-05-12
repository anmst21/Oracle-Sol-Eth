"use server";

import { UnifiedToken } from "@/types/coin-types";
import { DexScreenerToken, DexScreenerTokenMeta } from "@/types/SolanaCoins";

export async function fetchSolanaCoins(): Promise<UnifiedToken[] | null> {
  try {
    const response = await fetch(
      "https://api.dexscreener.com/token-boosts/top/v1",
      { cache: "force-cache", next: { revalidate: 60 * 60 } }
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
      `https://api.dexscreener.com/tokens/v1/solana/${tokenAddresses}`,
      { cache: "force-cache", next: { revalidate: 60 * 60 } }
    );

    const metaData: DexScreenerTokenMeta[] = await priceResponse.json();

    const generalized = metaData.map((t) => ({
      source: "solTrending" as const,
      chainId: 792703809,
      address: t.baseToken.address,
      symbol: t.baseToken.symbol,
      logo: t.info.imageUrl || "",
      priceUsd: Number(t.priceUsd),
      priceNative: Number(t.priceNative),
      name: t.baseToken.name,
    }));

    return generalized;
  } catch (error) {
    console.error("Error fetching popular tokens:", error);
    return null;
  }
}

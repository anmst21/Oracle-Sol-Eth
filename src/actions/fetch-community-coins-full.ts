"use server";

import { FetchedCoin } from "@/types/CommunityCoins";

export async function fetchCommunityCoinsRaw(): Promise<
  FetchedCoin[] | null
> {
  try {
    const response = await fetch("https://www.farcaster.in/api/tokens");
    if (!response.ok) {
      throw new Error(`Failed to fetch coins: ${response.statusText}`);
    }
    const data: FetchedCoin[] = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch full community coins:", error);
    return null;
  }
}

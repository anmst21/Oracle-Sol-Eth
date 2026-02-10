"use server";

import { geckoTerminalBaseUri } from "@/helpers/gecko-terminal-dex-data";
import { PoolResponse } from "@/types/token-pools";
export const getPoolsForToken = async (
  address: string,
  chainName: string,
  page: number = 1
) => {
  try {
    const res = await fetch(
      `${geckoTerminalBaseUri}/networks/${chainName}/tokens/${address}/pools?page=${page}`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) {
      throw new Error("Error fetching token pools: HTTP " + res.status);
    }

    const json: PoolResponse = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching token pools:", err);
    throw err;
  }
};

"use server";

import { TIMEFRAMES } from "@/helpers/chart-options";
import { geckoTerminalBaseUri } from "@/helpers/gecko-terminal-dex-data";
import { OHLCVResponse } from "@/types/chart-data";

export const getTokenHistoricalData = async (
  poolAddress: string,
  chainName: string,
  range: keyof typeof TIMEFRAMES
) => {
  try {
    const { timeframe, aggregate, limit } = TIMEFRAMES[range];

    // ensure no trailing slash
    const base = geckoTerminalBaseUri.replace(/\/$/, "");

    // put back the `/networks` prefix
    const endpoint = [
      base,
      "networks",
      chainName,
      "pools",
      poolAddress,
      "ohlcv",
      timeframe,
    ].join("/");

    const params = new URLSearchParams();
    params.set("aggregate", aggregate.toString());
    if (limit != null) {
      params.set("limit", limit.toString());
    }

    const url = `${endpoint}?${params.toString()}`;
    // console.log("fetching OHLCV →", url);

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      const body = await res.text();
      console.error("OHLCV fetch error:", body);
      throw new Error(`Failed to fetch OHLCV: ${res.status}`);
    }

    const result: OHLCVResponse = await res.json();
    // console.log("resres", result);

    return result.data.attributes.ohlcv_list;
  } catch (err) {
    console.error("getTokenHistoricalData error:", err);
    return null; // or throw err if you want the caller to handle it
  }
};

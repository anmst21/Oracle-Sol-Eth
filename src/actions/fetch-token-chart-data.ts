"use server";

import {
  ChartSortType,
  geckoTerminalBaseUri,
} from "@/helpers/gecko-terminal-dex-data";
import { OHLCVResponse } from "@/types/chart-data";

export const getTokenHistoricalData = async (
  poolAddress: string,
  chainName: string,
  type: ChartSortType
) => {
  const timeframe = () => {
    switch (type) {
      case ChartSortType.Hour:
        return "minute?aggregate=1";
      case ChartSortType.Day:
        return "minute?aggregate=5";
      case ChartSortType.Week:
        return "minute?aggregate=15";
      case ChartSortType.Month:
        return "hour?aggregate=1";
    }
  };

  const limit = () => {
    switch (type) {
      case ChartSortType.Hour:
        return 60;
      case ChartSortType.Day:
        return 192;
      case ChartSortType.Week:
        return 672;
      case ChartSortType.Month:
        return 744;
    }
  };

  try {
    const baseUrl = `${geckoTerminalBaseUri}/networks/${chainName}/pools/${poolAddress}/ohlcv/${timeframe()}`;
    const url = new URL(baseUrl);
    // Mirror the original axios params (aggregate always set to 1)
    url.searchParams.set("aggregate", "1");
    url.searchParams.set("limit", limit().toString());
    url.searchParams.set("currency", "usd");

    const res = await fetch(url.toString());
    if (!res.ok) {
      console.error("Error fetching historical data: HTTP " + res.status);
      return null;
    }

    const json: OHLCVResponse = await res.json();
    return json.data;
  } catch (err) {
    console.error("Error fetching historical data:", err);
    return null;
  }
};

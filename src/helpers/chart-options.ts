export type TFConfig = {
  timeframe: "minute" | "hour" | "day";
  aggregate: number;
  limit?: number;
};

export const TIMEFRAMES: Record<string, TFConfig> = {
  "5m": { timeframe: "minute", aggregate: 1, limit: 5 }, // 5×1m = 5m
  "1h": { timeframe: "minute", aggregate: 5, limit: 12 }, // 12×5m = 60m
  "6h": { timeframe: "minute", aggregate: 15, limit: 24 }, // 24×15m = 360m
  "24h": { timeframe: "hour", aggregate: 1, limit: 24 }, // 24×1h
  "7d": { timeframe: "hour", aggregate: 4, limit: 42 }, // 42×4h = 168h
  "30d": { timeframe: "day", aggregate: 1, limit: 30 }, // 30×1d
  max: { timeframe: "day", aggregate: 1 }, // up to 6 months (use default limit or max=1000)
};

export enum ChartSortOptions {
  FIVE_MUNUTES = "5m",
  HOUR = "1h",
  SIX_HOURS = "6h",
  DAY = "24h",
  WEEK = "7d",
  MONTH = "30d",
  MAX = "max",
}

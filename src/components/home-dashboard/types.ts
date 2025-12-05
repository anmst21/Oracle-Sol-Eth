export type ChainValues = {
  [chain: string]: number | undefined;
};

export type DailyChainEntry = {
  date: string; // ISO date string
  chains: ChainValues;
};

export type ChartData = DailyChainEntry[];

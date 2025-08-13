export type GeckoChain = {
  id: number;
  name: string;
  type: string;
  attributes: {
    name: string | null;
    coingecko_asset_platform_id: string | null;
  };
};

export enum ChartType {
  line = "line",
  candel = "candel",
}

export type PaginationProps = {
  disabled: boolean;
  currentPage: number;
  setPage: (value: number) => void;
  totalPages: number;
  disableRight?: boolean;
};

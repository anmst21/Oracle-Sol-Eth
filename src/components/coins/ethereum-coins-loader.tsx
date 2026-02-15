"use client";

import { fetchEthereumCoinsRaw } from "@/actions/fetch-ethereum-coins-full";
import { normalizeEthereumCoins } from "@/helpers/normalize-coins";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import CoinsTable, { CoinTokenMeta } from "./coins-table";

const ETH_CHAIN_ID = 1;

export default function EthereumCoinsLoader() {
  const [data, setData] = useState<MergedToken[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(() => {
    setIsError(false);
    startTransition(async () => {
      try {
        const coins = await fetchEthereumCoinsRaw();
        setData(coins);
      } catch {
        setIsError(true);
      }
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const normalized = useMemo(
    () => (data ? normalizeEthereumCoins(data) : null),
    [data]
  );

  const tokenMeta = useMemo(() => {
    if (!data) return undefined;
    const map = new Map<string, CoinTokenMeta>();
    for (const coin of data) {
      const logo = coin.meta?.base?.attributes?.image_url;
      if (logo) {
        map.set(coin.attributes.address, {
          logo,
          chainId: ETH_CHAIN_ID,
          name: coin.meta?.base?.attributes?.name ?? coin.attributes.name,
          symbol: coin.meta?.base?.attributes?.symbol ?? "",
        });
      }
    }
    return map;
  }, [data]);

  return (
    <CoinsTable
      data={normalized}
      isLoading={isPending && !data}
      isError={isError}
      onRetry={fetchData}
      tokenMeta={tokenMeta}
    />
  );
}

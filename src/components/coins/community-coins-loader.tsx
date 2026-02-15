"use client";

import { fetchCommunityCoinsRaw } from "@/actions/fetch-community-coins-full";
import { normalizeCommunityCoins } from "@/helpers/normalize-coins";
import { FetchedCoin } from "@/types/CommunityCoins";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import CoinsTable, { CoinTokenMeta } from "./coins-table";

export default function CommunityCoinsLoader() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") ?? "";
  const [data, setData] = useState<FetchedCoin[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(() => {
    setIsError(false);
    startTransition(async () => {
      try {
        const coins = await fetchCommunityCoinsRaw();
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
    () => (data ? normalizeCommunityCoins(data) : null),
    [data]
  );

  const sparklineData = useMemo(() => {
    if (!data) return undefined;
    const map = new Map<string, { price: string; date: number }[]>();
    for (const coin of data) {
      if (coin.priceStats?.length) {
        map.set(coin.stats.address, coin.priceStats);
      }
    }
    return map;
  }, [data]);

  const tokenMeta = useMemo(() => {
    if (!data) return undefined;
    const map = new Map<string, CoinTokenMeta>();
    for (const coin of data) {
      if (coin.imageURL) {
        const [symbol] = (coin.stats.name ?? "").split(" ");
        map.set(coin.stats.address, {
          logo: coin.imageURL,
          chainId: coin.chain_id,
          name: coin.name,
          symbol: symbol ?? coin.name,
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
      searchTerm={searchTerm}
      showSparkline
      sparklineData={sparklineData}
      tokenMeta={tokenMeta}
    />
  );
}

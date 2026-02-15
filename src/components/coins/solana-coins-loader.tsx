"use client";

import { fetchSolanaCoinsRaw } from "@/actions/fetch-solana-coins-full";
import { normalizeSolanaCoins } from "@/helpers/normalize-coins";
import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import CoinsTable, { CoinTokenMeta } from "./coins-table";

const SOLANA_CHAIN_ID = 792703809;

export default function SolanaCoinsLoader() {
  const [data, setData] = useState<DexScreenerTokenMeta[] | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(() => {
    setIsError(false);
    startTransition(async () => {
      try {
        const coins = await fetchSolanaCoinsRaw();
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
    () => (data ? normalizeSolanaCoins(data) : null),
    [data]
  );

  const tokenMeta = useMemo(() => {
    if (!data) return undefined;
    const map = new Map<string, CoinTokenMeta>();
    for (const coin of data) {
      if (coin.info?.imageUrl) {
        map.set(coin.pairAddress, {
          logo: coin.info.imageUrl,
          chainId: SOLANA_CHAIN_ID,
          name: coin.baseToken.name,
          symbol: coin.baseToken.symbol,
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

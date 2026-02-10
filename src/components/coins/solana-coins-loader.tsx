"use client";

import { fetchSolanaCoinsRaw } from "@/actions/fetch-solana-coins-full";
import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import { useEffect, useState, useTransition } from "react";

export default function SolanaCoinsLoader() {
  const [data, setData] = useState<DexScreenerTokenMeta[] | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const coins = await fetchSolanaCoinsRaw();
      setData(coins);
    });
  }, []);

  useEffect(() => {
    if (data) console.log("Solana coins (full):", data);
  }, [data]);

  return null;
}

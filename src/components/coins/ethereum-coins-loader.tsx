"use client";

import { fetchEthereumCoinsRaw } from "@/actions/fetch-ethereum-coins-full";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { useEffect, useState, useTransition } from "react";

export default function EthereumCoinsLoader() {
  const [data, setData] = useState<MergedToken[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const coins = await fetchEthereumCoinsRaw();
      setData(coins);
    });
  }, []);

  useEffect(() => {
    if (data) console.log("Ethereum coins (full):", data);
  }, [data]);

  return null;
}

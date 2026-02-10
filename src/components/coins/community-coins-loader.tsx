"use client";

import { fetchCommunityCoinsRaw } from "@/actions/fetch-community-coins-full";
import { FetchedCoin } from "@/types/CommunityCoins";
import { useEffect, useState, useTransition } from "react";

export default function CommunityCoinsLoader() {
  const [data, setData] = useState<FetchedCoin[] | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const coins = await fetchCommunityCoinsRaw();
      setData(coins);
    });
  }, []);

  useEffect(() => {
    if (data) console.log("Community coins (full):", data);
  }, [data]);

  return null;
}

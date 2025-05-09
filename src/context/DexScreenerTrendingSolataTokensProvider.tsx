"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import { fetchSolanaCoins } from "@/actions/fetch-solana-coins"; // your server fn

interface SolanaCoinsContextType {
  data: DexScreenerTokenMeta[] | null;
  isLoading: boolean;
  loadCoins: () => void;
}

const SolanaCoinsContext = createContext<SolanaCoinsContextType>({
  data: null,
  isLoading: false,
  loadCoins: () => {},
});

export const SolanaCoinsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<DexScreenerTokenMeta[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadCoins = useCallback(() => {
    startTransition(async () => {
      const coins = await fetchSolanaCoins();
      setData(coins);
    });
  }, []);

  return (
    <SolanaCoinsContext.Provider
      value={{ data, isLoading: isPending, loadCoins }}
    >
      {children}
    </SolanaCoinsContext.Provider>
  );
};

export const useSolanaCoins = () => useContext(SolanaCoinsContext);

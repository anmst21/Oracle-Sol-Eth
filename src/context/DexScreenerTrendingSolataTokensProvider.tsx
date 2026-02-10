"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import { fetchSolanaCoins } from "@/actions/fetch-solana-coins";
import { UnifiedToken } from "@/types/coin-types";

interface SolanaCoinsContextType {
  data: UnifiedToken[] | null;
  isLoading: boolean;
  error: string | null;
  loadCoins: () => void;
}

const SolanaCoinsContext = createContext<SolanaCoinsContextType>({
  data: null,
  isLoading: false,
  error: null,
  loadCoins: () => {},
});

export const SolanaCoinsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UnifiedToken[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadCoins = useCallback(() => {
    startTransition(async () => {
      try {
        setError(null);
        const coins = await fetchSolanaCoins();
        setData(coins);
      } catch (e) {
        console.error("Failed to load Solana coins:", e);
        setError(e instanceof Error ? e.message : "Failed to load coins");
      }
    });
  }, []);

  return (
    <SolanaCoinsContext.Provider
      value={{ data, isLoading: isPending, error, loadCoins }}
    >
      {children}
    </SolanaCoinsContext.Provider>
  );
};

export const useSolanaCoins = () => useContext(SolanaCoinsContext);

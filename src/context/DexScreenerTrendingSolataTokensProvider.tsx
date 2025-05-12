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
  loadCoins: () => void;
}

const SolanaCoinsContext = createContext<SolanaCoinsContextType>({
  data: null,
  isLoading: false,
  loadCoins: () => {},
});

export const SolanaCoinsProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UnifiedToken[] | null>(null);
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

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import { fetchCommunityCoins } from "@/actions/fetch-community-coins";
import { UnifiedToken } from "@/types/coin-types";

interface CommunityCoinsContextType {
  data: UnifiedToken[] | null;
  isLoading: boolean;
  error: string | null;
  loadCoins: () => void;
}

const CommunityCoinsContext = createContext<CommunityCoinsContextType>({
  data: null,
  isLoading: false,
  error: null,
  loadCoins: () => {},
});

export const CommunityCoinsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<UnifiedToken[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadCoins = useCallback(() => {
    startTransition(async () => {
      try {
        setError(null);
        const coins = await fetchCommunityCoins();
        setData(coins);
      } catch (e) {
        console.error("Failed to load community coins:", e);
        setError(e instanceof Error ? e.message : "Failed to load coins");
      }
    });
  }, []);

  return (
    <CommunityCoinsContext.Provider
      value={{ data, isLoading: isPending, error, loadCoins }}
    >
      {children}
    </CommunityCoinsContext.Provider>
  );
};

export const useCommunityCoins = () => useContext(CommunityCoinsContext);

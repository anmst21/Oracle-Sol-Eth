// contexts/GeckoTokensContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import { fetchTokensForChain } from "@/actions/fetch-tokens-for-chain";
import { UnifiedToken } from "@/types/coin-types";

interface GeckoTokensContextType {
  data: UnifiedToken[] | null;
  isLoading: boolean;
  error: string | null;
  loadTokens: (chain: string) => void;
}

const GeckoTokensContext = createContext<GeckoTokensContextType>({
  data: null,
  isLoading: false,
  error: null,
  loadTokens: () => {},
});

export const GeckoTokensProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UnifiedToken[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadTokens = useCallback((chain: string) => {
    startTransition(async () => {
      try {
        setError(null);
        const tokens = await fetchTokensForChain(chain);
        setData(tokens);
      } catch (e) {
        console.error("Failed to load Gecko tokens:", e);
        setError(e instanceof Error ? e.message : "Failed to load tokens");
      }
    });
  }, []);

  return (
    <GeckoTokensContext.Provider
      value={{ data, isLoading: isPending, error, loadTokens }}
    >
      {children}
    </GeckoTokensContext.Provider>
  );
};

export const useGeckoTokens = () => useContext(GeckoTokensContext);

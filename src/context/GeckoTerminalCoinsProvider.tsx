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
  loadTokens: (chain: string) => void;
}

const GeckoTokensContext = createContext<GeckoTokensContextType>({
  data: null,
  isLoading: false,
  loadTokens: () => {},
});

export const GeckoTokensProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<UnifiedToken[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadTokens = useCallback((chain: string) => {
    startTransition(async () => {
      const tokens = await fetchTokensForChain(chain);
      setData(tokens);
    });
  }, []);

  return (
    <GeckoTokensContext.Provider
      value={{ data, isLoading: isPending, loadTokens }}
    >
      {children}
    </GeckoTokensContext.Provider>
  );
};

export const useGeckoTokens = () => useContext(GeckoTokensContext);

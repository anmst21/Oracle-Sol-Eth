"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useTransition,
  ReactNode,
} from "react";
import { FormattedCoin } from "@/types/CommunityCoins";
import { fetchCommunityCoins } from "@/actions/fetch-community-coins";

interface CommunityCoinsContextType {
  data: FormattedCoin[] | null;
  isLoading: boolean;
  loadCoins: () => void;
}

const CommunityCoinsContext = createContext<CommunityCoinsContextType>({
  data: null,
  isLoading: false,
  loadCoins: () => {},
});

export const CommunityCoinsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [data, setData] = useState<FormattedCoin[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const loadCoins = useCallback(() => {
    startTransition(async () => {
      const coins = await fetchCommunityCoins();
      setData(coins);
    });
  }, []);

  return (
    <CommunityCoinsContext.Provider
      value={{ data, isLoading: isPending, loadCoins }}
    >
      {children}
    </CommunityCoinsContext.Provider>
  );
};

export const useCommunityCoins = () => useContext(CommunityCoinsContext);

"use client";

import { CoinbasePurchaseCurrency } from "@/types/coinbase-onramp";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface OnRampContextType {
  isOpenRegions: boolean;
  setIsOpenRegions: React.Dispatch<React.SetStateAction<boolean>>;
  coinbaseCryptos: CoinbasePurchaseCurrency[];
  setCoinbaseCryptos: React.Dispatch<
    React.SetStateAction<CoinbasePurchaseCurrency[]>
  >;
  userCountry: string;
  setUserCountry: React.Dispatch<React.SetStateAction<string>>;
  isSupported: boolean;
  setIsSupported: React.Dispatch<React.SetStateAction<boolean>>;
}

const OnRampContext = createContext<OnRampContextType | undefined>(undefined);

export interface OnRampProviderProps {
  children: ReactNode;
}

export const OnRampProvider: React.FC<OnRampProviderProps> = ({ children }) => {
  const [isOpenRegions, setIsOpenRegions] = useState(false);
  const [coinbaseCryptos, setCoinbaseCryptos] = useState<
    CoinbasePurchaseCurrency[]
  >([]);
  const [userCountry, setUserCountry] = useState("US");
  const [isSupported, setIsSupported] = useState(true);

  return (
    <OnRampContext.Provider
      value={{
        isOpenRegions,
        setIsOpenRegions,
        coinbaseCryptos,
        setCoinbaseCryptos,
        userCountry,
        setUserCountry,
        isSupported,
        setIsSupported,
      }}
    >
      {children}
    </OnRampContext.Provider>
  );
};

export const useOnRamp = (): OnRampContextType => {
  const context = useContext(OnRampContext);
  if (!context) {
    throw new Error("useOnRamp must be used within a OnRampProvider");
  }
  return context;
};

export default OnRampProvider;

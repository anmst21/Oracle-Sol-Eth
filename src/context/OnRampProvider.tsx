"use client";

import { MoonpayCryptoCurrency } from "@/types/moonpay-api";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface OnRampContextType {
  isOpenRegions: boolean;
  setIsOpenRegions: React.Dispatch<React.SetStateAction<boolean>>;
  moonpayCryptos: MoonpayCryptoCurrency[];
  setMoonpayCryptos: React.Dispatch<
    React.SetStateAction<MoonpayCryptoCurrency[]>
  >;
}

const OnRampContext = createContext<OnRampContextType | undefined>(undefined);

export interface OnRampProviderProps {
  children: ReactNode;
}

export const OnRampProvider: React.FC<OnRampProviderProps> = ({ children }) => {
  const [isOpenRegions, setIsOpenRegions] = useState(false);
  const [moonpayCryptos, setMoonpayCryptos] = useState<
    MoonpayCryptoCurrency[]
  >([]);

  return (
    <OnRampContext.Provider
      value={{ isOpenRegions, setIsOpenRegions, moonpayCryptos, setMoonpayCryptos }}
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

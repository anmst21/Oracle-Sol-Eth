"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface OnRampContextType {
  isOpenRegions: boolean;
  setIsOpenRegions: React.Dispatch<React.SetStateAction<boolean>>;
}

const OnRampContext = createContext<OnRampContextType | undefined>(undefined);

export interface OnRampProviderProps {
  children: ReactNode;
}

export const OnRampProvider: React.FC<OnRampProviderProps> = ({ children }) => {
  const [isOpenRegions, setIsOpenRegions] = useState(false);

  return (
    <OnRampContext.Provider value={{ isOpenRegions, setIsOpenRegions }}>
      {children}
      {/* <AnimatePresence mode="wait">
        {isOpenPools && <PoolsModal closeModal={() => setIsOpenPools(false)} />}
      </AnimatePresence>
     */}
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

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface SlippageContextType {
  isCustomSlippage: boolean;
  setIsCustomSlippage: Dispatch<SetStateAction<boolean>>;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}

const SlippageContext = createContext<SlippageContextType | undefined>(
  undefined
);

type SlippageProviderProps = {
  children: ReactNode;
};

export const SlippageProvider = ({ children }: SlippageProviderProps) => {
  const [isCustomSlippage, setIsCustomSlippage] = useState(false);
  const [value, setValue] = useState<number>(2.0);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <SlippageContext.Provider
      value={{
        isCustomSlippage,
        setIsCustomSlippage,
        value,
        setValue,
        isDragging,
        setIsDragging,
      }}
    >
      {children}
    </SlippageContext.Provider>
  );
};

export const useSlippage = (): SlippageContextType => {
  const context = useContext(SlippageContext);
  if (!context) {
    throw new Error("useSlippage must be used within a SlippageProvider");
  }
  return context;
};

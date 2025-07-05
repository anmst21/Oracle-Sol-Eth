"use client";

import HistoryModal from "@/components/history/history-modal";
import { AnimatePresence } from "motion/react";
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of the context
interface HistoryContextType {
  isOpenHistory: boolean;
  setIsOpenHistory: (open: boolean) => void;
}

// Create context with undefined default to enforce provider usage
const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

// Provider component
export interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({
  children,
}) => {
  const [isOpenHistory, setIsOpenHistory] = useState<boolean>(false);

  return (
    <HistoryContext.Provider value={{ isOpenHistory, setIsOpenHistory }}>
      {children}
      <AnimatePresence mode="wait">
        {isOpenHistory && (
          <HistoryModal closeModal={() => setIsOpenHistory(false)} />
        )}
      </AnimatePresence>
    </HistoryContext.Provider>
  );
};

// Custom hook for consuming the context
export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error("useHistory must be used within a HistoryProvider");
  }
  return context;
};

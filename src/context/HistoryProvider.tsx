"use client";

import HistoryModal from "@/components/history/history-modal";
import { HistorySortType } from "@/components/history/types";
import { AnimatePresence } from "motion/react";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";
import { useActiveWallet } from "./ActiveWalletContext";
import { SwapWallet } from "@/components/swap/types";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";

// Define the shape of the context
interface HistoryContextType {
  isOpenHistory: boolean;
  setIsOpenHistory: (open: boolean) => void;
  historyModalMode: HistorySortType;
  setHistoryModalMode: React.Dispatch<React.SetStateAction<HistorySortType>>;
  openModalPage: (mode: HistorySortType) => void;
  activeWallet: ConnectedWallet | ConnectedSolanaWallet | SwapWallet | null;
  setActiveWallet: React.Dispatch<
    React.SetStateAction<
      ConnectedWallet | ConnectedSolanaWallet | SwapWallet | null
    >
  >;
  activeChainId: number;
  setActiveChainId: React.Dispatch<React.SetStateAction<number>>;
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
  const [historyModalMode, setHistoryModalMode] =
    useState<HistorySortType>("network");

  const { activeWallet: defaultWallet } = useActiveWallet();
  const [activeWallet, setActiveWallet] = useState<
    SwapWallet | ConnectedWallet | ConnectedSolanaWallet | null
  >(null);

  useEffect(() => {
    if (!activeWallet && defaultWallet) setActiveWallet(defaultWallet);
  }, [activeWallet, defaultWallet]);

  const [activeChainId, setActiveChainId] = useState(0);

  const openModalPage = useCallback(
    (mode: HistorySortType) => {
      setHistoryModalMode(mode);
      setIsOpenHistory(true);
    },
    [setHistoryModalMode]
  );
  return (
    <HistoryContext.Provider
      value={{
        isOpenHistory,
        setIsOpenHistory,
        historyModalMode,
        setHistoryModalMode,
        openModalPage,
        activeWallet,
        setActiveWallet,
        activeChainId,
        setActiveChainId,
      }}
    >
      {children}
      <AnimatePresence mode="wait">
        {isOpenHistory && (
          <HistoryModal
            type={historyModalMode}
            setType={setHistoryModalMode}
            closeModal={() => setIsOpenHistory(false)}
          />
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

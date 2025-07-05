"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import { getPoolsForToken } from "@/actions/fetch-pools-for-tokents";
import { getTokenHistoricalData } from "@/actions/fetch-token-chart-data";
import { ChartType, GeckoChain } from "@/components/chart/types";
import { ChartSortType } from "@/helpers/gecko-terminal-dex-data";
import { OHLCVData } from "@/types/chart-data";
import { PoolItem } from "@/types/token-pools";
import { AnimatePresence } from "motion/react";
import PoolsModal from "@/components/chart/pools-modal";

// Test values for initial fetch; replace or parametrize as needed
const testContract = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const testChain = 8453;

export interface ChartContextType {
  tokenPools: PoolItem[] | null;
  isLoadingPools: boolean;
  isErrorPools: boolean;

  chartData: OHLCVData | null;
  isLoadingChart: boolean;
  isErrorChart: boolean;

  sortType: ChartSortType;
  setSortType: (type: ChartSortType) => void;

  chartType: ChartType;
  setChartType: (type: ChartType) => void;

  isOpenPools: boolean;
  setIsOpenPools: (type: boolean) => void;
}

const ChartContext = createContext<ChartContextType | undefined>(undefined);

export interface ChartProviderProps {
  children: ReactNode;
  geckoChains: GeckoChain[];
}

export const ChartProvider: React.FC<ChartProviderProps> = ({
  children,
  geckoChains,
}) => {
  const [tokenPools, setTokenPools] = useState<PoolItem[] | null>(null);
  const [isLoadingPools, setIsLoadingPools] = useState<boolean>(false);
  const [isErrorPools, setIsErrorPools] = useState<boolean>(false);

  const [chartData, setChartData] = useState<OHLCVData | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);
  const [isErrorChart, setIsErrorChart] = useState<boolean>(false);

  const [sortType, setSortType] = useState<ChartSortType>(ChartSortType.Month);
  const [chartType, setChartType] = useState<ChartType>(ChartType.line);

  const [isOpenPools, setIsOpenPools] = useState(false);

  const requestChain = useMemo(
    () => geckoChains.find((chain) => chain.id === testChain),
    [geckoChains]
  );

  // Fetch available pools for the token on mount or when chain changes
  useEffect(() => {
    if (!requestChain) return;
    const fetchPools = async () => {
      setIsErrorPools(false);
      setIsLoadingPools(true);
      try {
        const pools = await getPoolsForToken(testContract, requestChain.name);
        setTokenPools(pools);
      } catch (err) {
        console.error(err);
        setIsErrorPools(true);
      } finally {
        setIsLoadingPools(false);
      }
    };
    fetchPools();
  }, [requestChain]);

  // Fetch chart data whenever pools, chain, or sort order changes
  useEffect(() => {
    if (!requestChain || !tokenPools?.[0]?.attributes?.address) return;
    const fetchChart = async () => {
      setIsErrorChart(false);
      setIsLoadingChart(true);
      try {
        const data = await getTokenHistoricalData(
          tokenPools[0].attributes.address,
          requestChain.name,
          sortType
        );
        setChartData(data);
      } catch (err) {
        console.error(err);
        setIsErrorChart(true);
      } finally {
        setIsLoadingChart(false);
      }
    };
    fetchChart();
  }, [tokenPools, requestChain, sortType]);

  return (
    <ChartContext.Provider
      value={{
        tokenPools,
        isLoadingPools,
        isErrorPools,
        chartData,
        isLoadingChart,
        isErrorChart,
        sortType,
        setSortType,
        chartType,
        setChartType,
        isOpenPools,
        setIsOpenPools,
      }}
    >
      {children}
      <AnimatePresence mode="wait">
        {isOpenPools && <PoolsModal closeModal={() => setIsOpenPools(false)} />}
      </AnimatePresence>
    </ChartContext.Provider>
  );
};

export const useChart = (): ChartContextType => {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a ChartProvider");
  }
  return context;
};

export default ChartProvider;

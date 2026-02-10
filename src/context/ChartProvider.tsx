"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { getPoolsForToken } from "@/actions/fetch-pools-for-tokents";
import { getTokenHistoricalData } from "@/actions/fetch-token-chart-data";
import { ChartType, GeckoChain } from "@/components/chart/types";
import { PoolItem } from "@/types/token-pools";
import { AnimatePresence } from "motion/react";
import PoolsModal from "@/components/chart/pools-modal";

import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayChainFetch } from "@/types/relay-chain";
import TradesModal from "@/components/chart/trades-modal";
import { ChartSortOptions } from "@/helpers/chart-options";
import { UnifiedToken } from "@/types/coin-types";
import { baseEthToken } from "@/helpers/base-eth-token";

export interface ChartContextType {
  tokenPools: PoolItem[] | null;
  isLoadingPools: boolean;
  isErrorPools: boolean;

  chartData: number[][] | null;
  isLoadingChart: boolean;
  isErrorChart: boolean;

  sortType: ChartSortOptions;
  setSortType: (type: ChartSortOptions) => void;

  chartType: ChartType;
  setChartType: (type: ChartType) => void;

  isOpenPools: boolean;
  setIsOpenPools: (type: boolean) => void;

  isOpenTrades: boolean;
  setIsOpenTrades: React.Dispatch<React.SetStateAction<boolean>>;

  requestChain: GeckoChain | undefined;
  fetchPools: () => Promise<void>;
  activePool: PoolItem | null;
  setActivePool: React.Dispatch<React.SetStateAction<PoolItem | null>>;

  relayChain: RelayChainFetch | undefined;
  fetchChart: () => Promise<void>;
  activeToken: UnifiedToken | undefined;
  setActiveToken: React.Dispatch<React.SetStateAction<UnifiedToken>>;
  setIsErrorMorePools: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingMorePools: boolean;
  isErrorMorePools: boolean;
  isNoMorePools: boolean;
  fetchMorePoolsForToken: (page: number) => Promise<void>;
  setIsNoMorePools: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [activeToken, setActiveToken] = useState<UnifiedToken>(baseEthToken);
  const [tokenPools, setTokenPools] = useState<PoolItem[] | null>(null);
  const [isLoadingPools, setIsLoadingPools] = useState<boolean>(true);
  const [isErrorPools, setIsErrorPools] = useState<boolean>(false);

  const [isLoadingMorePools, setIsLoadingMorePools] = useState(false);
  const [isNoMorePools, setIsNoMorePools] = useState(false);
  const [isErrorMorePools, setIsErrorMorePools] = useState(false);

  useEffect(() => {
    setIsNoMorePools(false);
    setIsErrorMorePools(false);
    setIsErrorPools(false);
    setIsErrorChart(false);
    setChartData(null);
    setTokenPools(null);
    setActivePool(null);
  }, [activeToken]);

  const [activePool, setActivePool] = useState<PoolItem | null>(null);
  const [chartData, setChartData] = useState<number[][] | null>(null);
  const [isLoadingChart, setIsLoadingChart] = useState<boolean>(false);
  const [isErrorChart, setIsErrorChart] = useState<boolean>(false);

  const [sortType, setSortType] = useState<ChartSortOptions>(
    ChartSortOptions.DAY
  );
  const [chartType, setChartType] = useState<ChartType>(ChartType.line);

  const [isOpenPools, setIsOpenPools] = useState(false);

  const [isOpenTrades, setIsOpenTrades] = useState(false);

  const requestChain = useMemo(
    () => geckoChains.find((chain) => chain.id === activeToken.chainId),
    [activeToken, geckoChains]
  );

  const { chains } = useRelayChains();

  useEffect(() => {
    if (tokenPools) setActivePool(tokenPools[0]);
  }, [tokenPools]);

  // Fetch available pools for the token on mount or when chain changes

  const poolsAbortRef = useRef<AbortController | null>(null);

  const fetchPools = useCallback(async () => {
    if (!requestChain) return;

    poolsAbortRef.current?.abort();
    const ac = new AbortController();
    poolsAbortRef.current = ac;

    setIsErrorPools(false);
    setIsLoadingPools(true);
    try {
      const pools = await getPoolsForToken(
        activeToken.address,
        requestChain.name
      );
      if (ac.signal.aborted) return;
      setTokenPools(pools);
    } catch (err) {
      if (ac.signal.aborted) return;
      console.error(err);
      setActivePool(null);
      setIsErrorPools(true);
    } finally {
      if (!ac.signal.aborted) setIsLoadingPools(false);
    }
  }, [activeToken, requestChain]);

  useEffect(() => {
    if (!requestChain || !activeToken) return;
    fetchPools();
    return () => poolsAbortRef.current?.abort();
  }, [requestChain, activeToken]);

  const fetchMorePoolsForToken = useCallback(
    async (page: number) => {
      if (!activeToken?.address || !requestChain?.name || isLoadingMorePools)
        return;

      try {
        setIsLoadingMorePools(true);
        setIsErrorMorePools(false);

        const pools = await getPoolsForToken(
          activeToken.address,
          requestChain.name,
          page
        );

        if (pools.length === 0) {
          setIsNoMorePools(true);
        } else {
          setIsNoMorePools(false);
          setTokenPools((prev) => (prev ? [...prev, ...pools] : [...pools]));
        }
      } catch (err) {
        console.error(err);
        setIsErrorMorePools(true);
      } finally {
        setIsLoadingMorePools(false);
      }
    },
    [
      activeToken?.address, // the only pieces we actually read
      requestChain?.name,
      isLoadingMorePools, // guard against concurrent calls
      setTokenPools,
      setIsErrorMorePools,
      setIsLoadingMorePools,
      setIsNoMorePools,
    ]
  );
  // Fetch chart data whenever pools, chain, or sort order changes

  const chartAbortRef = useRef<AbortController | null>(null);

  const fetchChart = useCallback(async () => {
    if (!requestChain || !activePool) return;

    chartAbortRef.current?.abort();
    const ac = new AbortController();
    chartAbortRef.current = ac;

    setIsErrorChart(false);
    setIsLoadingChart(true);
    try {
      const data = await getTokenHistoricalData(
        activePool.attributes.address,
        requestChain.name,
        sortType
      );
      if (ac.signal.aborted) return;
      setChartData(data);
    } catch (err) {
      if (ac.signal.aborted) return;
      console.error(err);
      setIsErrorChart(true);
    } finally {
      if (!ac.signal.aborted) setIsLoadingChart(false);
    }
  }, [sortType, activePool, requestChain]);

  useEffect(() => {
    if (!requestChain || !activePool) return;
    fetchChart();
    return () => chartAbortRef.current?.abort();
  }, [activePool, requestChain, sortType]);

  const relayChain = useMemo(
    () => chains?.find((c) => c.id === requestChain?.id) as RelayChainFetch,
    [chains, requestChain]
  );

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
        requestChain,
        activePool,
        setActivePool,
        relayChain,
        isOpenTrades,
        setIsOpenTrades,
        activeToken,
        setActiveToken,
        fetchPools,
        isLoadingMorePools,
        isErrorMorePools,
        isNoMorePools,
        fetchMorePoolsForToken,
        fetchChart,
        setIsErrorMorePools,
        setIsNoMorePools,
      }}
    >
      {children}
      <AnimatePresence mode="wait">
        {isOpenPools && <PoolsModal closeModal={() => setIsOpenPools(false)} />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {isOpenTrades && (
          <TradesModal closeModal={() => setIsOpenTrades(false)} />
        )}
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

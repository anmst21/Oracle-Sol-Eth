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
import { PoolItem } from "@/types/token-pools";
import { AnimatePresence } from "motion/react";
import PoolsModal from "@/components/chart/pools-modal";

import { useRelayChains, useTokenList } from "@reservoir0x/relay-kit-hooks";
import { RelayTokenMeta } from "@/types/relay-token-meta";
import { RelayChainFetch } from "@/types/relay-chain";
import TradesModal from "@/components/chart/trades-modal";
import { ChartSortOptions } from "@/helpers/chart-options";
import { UnifiedToken } from "@/types/coin-types";

// Test values for initial fetch; replace or parametrize as needed
//const address = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const address = "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn";
//FAqh648xeeaTqL7du49sztp9nfj5PjRQrfvaMccyd9cz
//const chainId = 8453;
const chainId = 792703809;

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

  activePool: PoolItem | null;
  setActivePool: React.Dispatch<React.SetStateAction<PoolItem | null>>;

  tokenMeta: RelayTokenMeta | null;

  relayChain: RelayChainFetch | undefined;

  activeToken: UnifiedToken | undefined;
  setActiveToken: React.Dispatch<React.SetStateAction<UnifiedToken>>;
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
  const [activeToken, setActiveToken] = useState<UnifiedToken>({
    source: "eth",
    chainId: 8453,
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    logo: "https://assets.relay.link/icons/1/light.png",
    name: "Ether",
  });
  const [tokenPools, setTokenPools] = useState<PoolItem[] | null>(null);
  const [isLoadingPools, setIsLoadingPools] = useState<boolean>(false);
  const [isErrorPools, setIsErrorPools] = useState<boolean>(false);

  const [activePool, setActivePool] = useState<PoolItem | null>(null);
  console.log("activeToken", activeToken);
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
  useEffect(() => {
    if (!requestChain) return;
    const fetchPools = async () => {
      setIsErrorPools(false);
      setIsLoadingPools(true);
      try {
        const pools = await getPoolsForToken(
          activeToken.address,
          requestChain.name
        );
        setTokenPools(pools);
      } catch (err) {
        console.error(err);
        setIsErrorPools(true);
      } finally {
        setIsLoadingPools(false);
      }
    };
    fetchPools();
  }, [requestChain, activeToken]);

  // Fetch chart data whenever pools, chain, or sort order changes
  useEffect(() => {
    if (!requestChain || !activePool) return;
    const fetchChart = async () => {
      setIsErrorChart(false);
      setIsLoadingChart(true);
      try {
        const data = await getTokenHistoricalData(
          activePool.attributes.address,
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
  }, [activePool, requestChain, sortType]);

  const { data: meta } = useTokenList("https://api.relay.link", {
    address: address ? address : undefined,

    chainIds: chainId ? [chainId] : undefined,
  });

  const tokenMeta = useMemo(() => (meta ? meta[0] : null), [meta]);

  const relayChain = useMemo(
    () => chains?.find((c) => c.id === requestChain?.id) as RelayChainFetch,
    [chains, requestChain]
  );
  console.log("tokenMeta", tokenMeta);

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
        tokenMeta,
        relayChain,
        isOpenTrades,
        setIsOpenTrades,
        activeToken,
        setActiveToken,
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

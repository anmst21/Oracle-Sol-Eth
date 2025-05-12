import { useState, useCallback, useMemo } from "react";
import { queryRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayChain } from "@/types/relay-query-chain-type";

const BITCOIN_CHAIN_ID = 8253038;
const FEATURED_CHAIN_IDS = new Set<number>([
  7777777, 42161, 8453, 1, 56, 666666666, 792703809,
]);

export interface UseChainsDataResult {
  isLoading: boolean;
  isLoaded: boolean;
  error: Error | null;
  chains: RelayChain[];
  nonBitcoin: RelayChain[];
  featuredChains: RelayChain[];
  otherChains: RelayChain[];
  solanaChain?: RelayChain;
  baseChain?: RelayChain;
  ethereumChain?: RelayChain;
  /** Call this to fetch & filter chains on demand */
  loadChains: () => Promise<void>;
}

export function useChainsData(): UseChainsDataResult {
  const [chains, setChains] = useState<RelayChain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadChains = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const allChains = await queryRelayChains("https://api.relay.link", {});
      if (!allChains.chains) return;

      const nonBitcoin = allChains.chains.filter(
        (c) => c.id !== BITCOIN_CHAIN_ID
      );
      setChains(nonBitcoin);
      setIsLoaded(true);
    } catch (err) {
      console.error("queryRelayChains failed:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // derive partitions from `chains`
  const nonBitcoin = useMemo(() => chains, [chains]);
  const featuredChains = useMemo(
    () => nonBitcoin.filter((c) => FEATURED_CHAIN_IDS.has(c.id as number)),
    [nonBitcoin]
  );
  const otherChains = useMemo(
    () => nonBitcoin.filter((c) => !FEATURED_CHAIN_IDS.has(c.id as number)),
    [nonBitcoin]
  );
  const solanaChain = useMemo(
    () => featuredChains.find((c) => c.id === 792703809),
    [featuredChains]
  );
  const ethereumChain = useMemo(
    () => featuredChains.find((c) => c.id === 1),
    [featuredChains]
  );
  const baseChain = useMemo(
    () => featuredChains.find((c) => c.id === 8453),
    [featuredChains]
  );

  return {
    ethereumChain,
    isLoading,
    isLoaded,
    error,
    chains,
    nonBitcoin,
    featuredChains,
    otherChains,
    solanaChain,
    baseChain,
    loadChains,
  };
}

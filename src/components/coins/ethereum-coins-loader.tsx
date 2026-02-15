"use client";

import { fetchCoinsPage } from "@/actions/fetch-coins-page";
import { normalizeEthereumCoins } from "@/helpers/normalize-coins";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import CoinsTable, { CoinTokenMeta } from "./coins-table";

const ETH_CHAIN_ID = 1;
const ITEMS_PER_PAGE = 20;

export default function EthereumCoinsLoader() {
  const [allData, setAllData] = useState<MergedToken[]>([]);
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorMore, setIsErrorMore] = useState(false);
  const [isNoMore, setIsNoMore] = useState(false);

  const fetchedPages = useRef(new Set<number>());
  const loadingRef = useRef(false);

  const pages2D = useMemo(() => {
    const result: MergedToken[][] = [];
    for (let i = 0; i < allData.length; i += ITEMS_PER_PAGE) {
      result.push(allData.slice(i, i + ITEMS_PER_PAGE));
    }
    return result;
  }, [allData]);

  const fetchPage = useCallback(async (page: number) => {
    if (loadingRef.current) return;
    loadingRef.current = true;
    const isFirst = page === 1;
    if (isFirst) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      const coins = await fetchCoinsPage("eth", page);
      if (!coins || coins.length === 0) {
        setIsNoMore(true);
      } else {
        setAllData((prev) => [...prev, ...coins]);
      }
    } catch {
      if (isFirst) setIsError(true);
      else setIsErrorMore(true);
    } finally {
      if (isFirst) setIsLoading(false);
      else setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const chunk = pages2D[currentPage - 1];
    if (
      !chunk &&
      !loadingRef.current &&
      !isNoMore &&
      !isErrorMore &&
      !fetchedPages.current.has(currentPage)
    ) {
      fetchedPages.current.add(currentPage);
      fetchPage(currentPage);
    }
  }, [currentPage, pages2D, isNoMore, isErrorMore, fetchPage]);

  useEffect(() => {
    if (isNoMore && allData.length > 0) {
      setTotalPages(Math.max(1, Math.ceil(allData.length / ITEMS_PER_PAGE)));
    }
  }, [isNoMore, allData.length]);

  const goBack = useCallback(() => {
    setIsErrorMore(false);
    setIsNoMore(true);
    fetchedPages.current.delete(currentPage);
    setTotalPages(currentPage - 1);
    setCurrentPage(currentPage - 1);
  }, [currentPage]);

  const currentItems = useMemo(() => {
    const chunk = pages2D[currentPage - 1];
    return chunk ? normalizeEthereumCoins(chunk) : null;
  }, [pages2D, currentPage]);

  const tokenMeta = useMemo(() => {
    if (allData.length === 0) return undefined;
    const map = new Map<string, CoinTokenMeta>();
    for (const coin of allData) {
      const logo = coin.meta?.base?.attributes?.image_url;
      if (logo) {
        map.set(coin.attributes.address, {
          logo,
          chainId: ETH_CHAIN_ID,
          name: coin.meta?.base?.attributes?.name ?? coin.attributes.name,
          symbol: coin.meta?.base?.attributes?.symbol ?? "",
        });
      }
    }
    return map;
  }, [allData]);

  return (
    <CoinsTable
      data={currentItems}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => {
        setIsError(false);
        fetchedPages.current.delete(1);
        fetchPage(1);
      }}
      tokenMeta={tokenMeta}
      defaultChainId={ETH_CHAIN_ID}
      paginationMode="server"
      totalPages={totalPages}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      isLoadingMore={isLoadingMore}
      isErrorMore={isErrorMore}
      isNoMore={isNoMore}
      goBack={goBack}
    />
  );
}

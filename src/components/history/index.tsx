"use client";

import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { HexChain, HistorySortEnable, HistorySortDisable } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import Image from "next/image";
import { queryRequests, useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayTransaction } from "@/types/relay-transaction";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { truncateAddress } from "@/helpers/truncate-address";
import HistoryItem from "./history-item";
import { useScroll } from "framer-motion";
import HistoryItemSkeleton from "./history-item-skeleton";
import HistoryItemWarning from "./history-item-warning";
import { useRouter } from "next/navigation";
import { useHistory } from "@/context/HistoryProvider";

const History = () => {
  const containerRef = useRef<HTMLDivElement>(null); // ②

  const { openModalPage } = useHistory();

  const { chains, isLoading: isLoadingChains } = useRelayChains();
  const { activeWallet } = useActiveWallet();
  const chainId =
    activeWallet?.type === "ethereum"
      ? Number(activeWallet.chainId.split(":")[1])
      : 792703809;

  const [transactions, setTransactions] = useState<RelayTransaction[]>([]);
  const [continuation, setContinuation] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Combined fetch fn
  const fetchRequests = useCallback(
    async (opts: { append: boolean; continuation?: string }) => {
      if (!activeWallet?.address) return;
      const { append, continuation: cont } = opts;

      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        console.log({
          user: activeWallet.address,
          chainId: String(chainId),
          limit: "20",
          ...(cont ? { continuation: cont } : {}),
        });
        const res = await queryRequests("https://api.relay.link", {
          user: activeWallet.address,
          chainId: String(chainId),
          limit: "20",
          ...(cont ? { continuation: cont } : {}),
        });
        setTransactions((prev) =>
          append
            ? [...prev, ...(res.requests as RelayTransaction[])]
            : (res.requests as RelayTransaction[])
        );
        setContinuation(res.continuation);
      } catch (err) {
        if (err instanceof Error) {
          console.error(err);
          setError(err.message || "Failed to fetch transactions");
        }
      } finally {
        if (append) {
          setIsLoadingMore(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [activeWallet?.address, chainId]
  );

  // initial load
  useEffect(() => {
    if (activeWallet?.address) {
      fetchRequests({ append: false });
    }
  }, [activeWallet?.address, fetchRequests]);

  // Framer Motion scroll observer
  const { scrollYProgress } = useScroll({
    container: containerRef, // ③
  });

  // fire loadMore once scrolled past 90%
  useEffect(() => {
    return scrollYProgress.onChange((progress) => {
      if (progress > 0.9 && continuation && !isLoadingMore) {
        fetchRequests({ append: true, continuation });
      }
    });
  }, [scrollYProgress, continuation, isLoadingMore, fetchRequests]);

  const chainItem = useMemo(
    () => chains?.find((chain) => chain.id === chainId),
    [chains, chainId]
  );

  const skeletonArray = Array.from({ length: 3 }).map((_, i) => (
    <HistoryItemSkeleton key={`more-${i}`} />
  ));

  const { push } = useRouter();

  return (
    <div className="history-component">
      <div className="history-sort">
        <div className="history-sort__title">
          <span>Sorted By:</span>
        </div>
        <button
          onClick={() => openModalPage("network")}
          className="history-sort__network"
        >
          <div className="history-sort__icon">
            <HexChain
              width={20}
              uri={!isLoadingChains ? getIconUri(1) : undefined}
              question={isLoadingChains}
            />
          </div>
          <div className="history-sort__value">
            <span>{chainItem?.displayName}</span>
          </div>
        </button>
        <button
          onClick={() => openModalPage("wallet")}
          className="history-sort__address"
        >
          <div className="history-sort__icon">
            {activeWallet?.meta?.icon && (
              <Image
                alt={activeWallet?.meta.id}
                src={activeWallet?.meta.icon.replace(/^\n+/, "").trimEnd()}
                width={20}
                height={20}
              />
            )}
          </div>
          <div className="history-sort__value">
            <span>
              {activeWallet?.address
                ? truncateAddress(activeWallet?.address)
                : "x0XXXX...XXXX"}
            </span>
          </div>
        </button>
        <button className="history-sort__reset">
          <HistorySortEnable />
        </button>
      </div>

      <div
        ref={containerRef} // ④
        className="history-transactions"
        style={{ maxHeight: "600px", overflowY: "auto" }}
      >
        {!isLoading && !error && transactions.length === 0 && (
          <HistoryItemWarning callback={() => push("/swap")} />
        )}
        {isLoading ? (
          skeletonArray
        ) : error ? (
          <HistoryItemWarning
            error={error}
            callback={() => fetchRequests({ append: false })}
          />
        ) : transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          transactions.map((tx, i) => {
            const currencyIn = tx.data?.metadata?.currencyIn;
            const currencyOut = tx.data?.metadata?.currencyOut;
            const fromChainData = chains?.find(
              (c) => c.id === currencyIn?.currency?.chainId
            );
            const toChainData = chains?.find(
              (c) => c.id === currencyOut?.currency?.chainId
            );
            return (
              <HistoryItem
                key={i}
                fromChainData={fromChainData}
                toChainData={toChainData}
                status={tx.status}
                txAdderss={tx.id}
                timestamp={tx.createdAt}
                currencyIn={currencyIn}
                currencyOut={currencyOut}
                sender={tx.user}
                recipient={tx.recipient}
              />
            );
          })
        )}
        {isLoadingMore && skeletonArray}
      </div>
    </div>
  );
};

export default History;

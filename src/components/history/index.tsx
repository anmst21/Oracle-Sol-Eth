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
import { solanaChain } from "@/helpers/solanaChain";
import { ConnectedSolanaWallet, ConnectedWallet } from "@privy-io/react-auth";
import { AnimatePresence, motion } from "motion/react";
import { slidingTextAnimation } from "../swap/animation";

const History = () => {
  const containerRef = useRef<HTMLDivElement>(null); // ②

  const {
    openModalPage,
    activeChainId,
    activeWallet: AW,
    setActiveChainId,
    setActiveWallet,
  } = useHistory();
  const activeWallet = AW as ConnectedWallet | ConnectedSolanaWallet | null;

  const { chains, isLoading: isLoadingChains } = useRelayChains();
  const { activeWallet: globalActiveWallet } = useActiveWallet();
  // const chainId =
  //   activeWallet?.type === "ethereum"
  //     ? Number(activeWallet.chainId)
  //     : 792703809;

  const [transactions, setTransactions] = useState<RelayTransaction[]>([]);
  const [continuation, setContinuation] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetSettings = useCallback(() => {
    setActiveWallet(globalActiveWallet);
    setActiveChainId(0);
  }, [setActiveWallet, setActiveChainId, globalActiveWallet]);

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
        // console.log({
        //   user: activeWallet.address,
        //   chainId: String(activeChainId),
        //   limit: "20",
        //   ...(cont ? { continuation: cont } : {}),
        // });
        const res = await queryRequests("https://api.relay.link", {
          user: activeWallet.address,
          chainId: activeChainId === 0 ? undefined : String(activeChainId),
          limit: 20,
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
    [activeWallet?.address, activeChainId]
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
    () => chains?.find((chain) => chain.id === activeChainId),
    [chains, activeChainId]
  );

  const skeletonArray = Array.from({ length: 3 }).map((_, i) => (
    <HistoryItemSkeleton key={`more-${i}`} />
  ));

  const { push } = useRouter();

  const allChainIds = useMemo(
    () => [solanaChain?.id, 8453, 1].filter(Boolean) as number[],
    []
  );

  const ethChain = useMemo(() => {
    return chains?.find((c) => c.id === 1);
  }, [chains]);
  const solChain = useMemo(() => {
    return chains?.find((c) => c.id === solanaChain.id);
  }, [chains]);

  const btnFadeAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2 },
  };

  const sortDisable =
    !activeWallet ||
    (globalActiveWallet?.address === activeWallet?.address &&
      activeChainId === 0);

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
          <div key={activeChainId} className="history-sort__icon">
            {activeChainId === 0 ? (
              <div className="all-chains-icon">
                {allChainIds.map((id, i) => (
                  <HexChain
                    key={id}
                    strokeWidth={2}
                    width={12}
                    uri={getIconUri(id)}
                    className={`all-chains-icon__${i + 1}`}
                  />
                ))}
              </div>
            ) : (
              <HexChain
                width={20}
                uri={!isLoadingChains ? getIconUri(activeChainId) : undefined}
                question={isLoadingChains}
              />
            )}
          </div>
          <div className="history-sort__value">
            <AnimatePresence mode="popLayout">
              <motion.span
                {...slidingTextAnimation}
                key={`chains-btn-${activeChainId}`}
              >
                {activeChainId === 0 ? "All" : chainItem?.displayName}
              </motion.span>
            </AnimatePresence>
          </div>
        </button>
        <button
          onClick={() => openModalPage("wallet")}
          className="history-sort__address"
        >
          <div className="history-sort__icon">
            {/* {activeWallet?.meta?.icon && (
              <Image
                alt={activeWallet?.meta.id}
                src={activeWallet?.meta.icon.replace(/^\n+/, "").trimEnd()}
                width={20}
                height={20}
              />
            )} */}
            {activeWallet?.type === "ethereum" && ethChain && (
              <Image
                alt={"Ethereum Wallet"}
                src={getIconUri(ethChain.id)}
                width={20}
                height={20}
              />
            )}
            {activeWallet?.type === "solana" && solChain && (
              <Image
                alt={"Solana Wallet"}
                src={getIconUri(solChain.id)}
                width={20}
                height={20}
              />
            )}
          </div>
          <div className="history-sort__value">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={activeWallet?.address}
                {...slidingTextAnimation}
              >
                {activeWallet?.address
                  ? truncateAddress(activeWallet?.address)
                  : "Connect"}
              </motion.span>
            </AnimatePresence>
          </div>
        </button>

        <button
          onClick={resetSettings}
          disabled={sortDisable}
          className="history-sort__reset"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              style={{ display: "flex" }}
              {...btnFadeAnimation}
              key={`btn-sort-${sortDisable}`}
            >
              {sortDisable ? <HistorySortEnable /> : <HistorySortDisable />}
            </motion.div>
          </AnimatePresence>
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
        ) : transactions.length === 0 ? null : (
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

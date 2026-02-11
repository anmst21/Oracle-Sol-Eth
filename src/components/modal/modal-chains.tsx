import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HexChain, InputCross, SearchGlass } from "../icons";
import classNames from "classnames";
import { RelayChain } from "@/types/relay-query-chain-type";
import { getIconUri } from "@/helpers/get-icon-uri";
import SkeletonLoaderWrapper from "../skeleton";
import ChainSkeleton from "./chain-skeleton";
import { ModalMode } from "@/types/modal-mode";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { motion, AnimatePresence } from "motion/react";

export const MOONPAY_CHAIN_ID = -1;

type Props = {
  activeChainId: number;
  setActiveChainId: (value: number) => void;
  featuredChains: RelayChain[];
  otherChains: RelayChain[];
  baseChain: RelayChain | undefined;
  solanaChain: RelayChain | undefined;
  ethereumChain: RelayChain | undefined;
  isLoadingChains: boolean;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  disableSearch?: boolean;
  modalMode?: ModalMode;
};

const ModalChains = ({
  setActiveChainId,
  activeChainId,
  featuredChains,
  otherChains,
  baseChain,
  solanaChain,
  ethereumChain,
  isLoadingChains,
  setSearchTerm,
  searchTerm,
  disableSearch,
  modalMode,
}: Props) => {
  const isDesktop = useIsDesktop();
  const [isExpanded, setIsExpanded] = useState(false);
  const chainsRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click (mobile only)
  useEffect(() => {
    if (isDesktop || !isExpanded) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (chainsRef.current && !chainsRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop, isExpanded, setSearchTerm]);

  // Auto-focus input when expanding
  useEffect(() => {
    if (!isDesktop && isExpanded) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isDesktop, isExpanded]);

  // Combine your "all‐chain" icons
  const allChainIds = useMemo(
    () =>
      [solanaChain?.id, baseChain?.id, ethereumChain?.id].filter(
        Boolean
      ) as number[],
    [solanaChain, baseChain, ethereumChain]
  );

  // Memoized filter function
  const filterChains = useCallback(
    (list: RelayChain[]) => {
      if (!searchTerm) return list;
      const lower = searchTerm.toLowerCase();

      return list.filter((c) => {
        if (!c.displayName || !c.id) return;
        return (
          c.displayName.toLowerCase().includes(lower) ||
          c.id.toString().includes(lower)
        );
      });
    },
    [searchTerm]
  );

  // Apply filtering
  const displayedFeatured = useMemo(
    () => filterChains(featuredChains),
    [featuredChains, filterChains]
  );
  const displayedOther = useMemo(
    () => filterChains(otherChains),
    [otherChains, filterChains]
  );

  const handleChainSelect = useCallback(
    (id: number) => {
      setActiveChainId(id);
      if (!isDesktop) setIsExpanded(false);
    },
    [setActiveChainId, isDesktop]
  );

  const handleSearchClose = useCallback(() => {
    setSearchTerm("");
    if (!isDesktop) setIsExpanded(false);
  }, [setSearchTerm, isDesktop]);

  const isMobileCollapsed = !isDesktop && !isExpanded;

  return (
    <motion.div
      ref={chainsRef}
      className={classNames("modal-chains", {
        "modal-chains--collapsed": isMobileCollapsed,
      })}
      initial={false}
      animate={
        !isDesktop
          ? {
              width: isMobileCollapsed ? 46 : 200,
              flexShrink: 0,
            }
          : undefined
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Search input */}
      {!disableSearch && (
        <div className="chain-sidebar__contianer">
          {isMobileCollapsed ? (
            <button
              className="chain-sidebar__input chain-sidebar__input--search-btn"
              onClick={() => setIsExpanded(true)}
            >
              <SearchGlass />
            </button>
          ) : (
            <label className="chain-sidebar__input">
              <SearchGlass />
              <input
                ref={searchInputRef}
                disabled={isLoadingChains}
                type="text"
                placeholder="Enter name or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
              />
              {!isDesktop && (
                <button
                  onClick={handleSearchClose}
                  className="chain-sidebar__input__abandon"
                >
                  <InputCross />
                </button>
              )}
              {isDesktop && searchTerm.length > 0 && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="chain-sidebar__input__abandon"
                >
                  <InputCross />
                </button>
              )}
            </label>
          )}
        </div>
      )}
      <div className="modal-chains__scroll">
        {/* MoonPay button — only in onramp mode */}
        {modalMode === "onramp" && (
          <div className="chain-sidebar__contianer">
            <button
              className={classNames("chain-sidebar", {
                "chain-sidebar--active": activeChainId === MOONPAY_CHAIN_ID,
              })}
              onClick={() => handleChainSelect(MOONPAY_CHAIN_ID)}
            >
              <HexChain uri="https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/moonpay-logo-lg.png" />
              <AnimatePresence mode="popLayout">
                {!isMobileCollapsed && (
                  <motion.span
                    initial={!isDesktop ? { width: 0, opacity: 0 } : false}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    MoonPay
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        )}

        {/* "All Chains" button */}
        <div className="chain-sidebar__contianer">
          <button
            className={classNames("chain-sidebar", {
              "chain-sidebar--active": activeChainId === 0,
            })}
            onClick={() => handleChainSelect(0)}
          >
            <div className="all-chains-icon">
              <SkeletonLoaderWrapper
                radius={2}
                height={24}
                width={24}
                isLoading={false}
                flex
              >
                {allChainIds.map((id, i) => (
                  <HexChain
                    key={id}
                    strokeWidth={2}
                    width={12}
                    uri={getIconUri(id)}
                    className={`all-chains-icon__${i + 1}`}
                  />
                ))}
              </SkeletonLoaderWrapper>
            </div>
            <AnimatePresence mode="popLayout">
              {!isMobileCollapsed && (
                <motion.div
                  initial={!isDesktop ? { width: 0, opacity: 0 } : false}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <SkeletonLoaderWrapper
                    radius={2}
                    height={24}
                    width={"auto"}
                    isLoading={false}
                    flex
                  >
                    <span>All Chains</span>
                  </SkeletonLoaderWrapper>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Featured */}

        <div className="chain-sidebar__contianer">
          <AnimatePresence mode="popLayout">
            {!isMobileCollapsed && (
              <motion.div
                className="chain-sidebar__header"
                initial={!isDesktop ? { height: 0, opacity: 0 } : false}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Featured Chains
              </motion.div>
            )}
          </AnimatePresence>
          {displayedFeatured.length > 0 && !isLoadingChains
            ? displayedFeatured.map((chain) => {
                if (!chain.id) return;
                return (
                  <button
                    disabled={isLoadingChains}
                    key={chain.id}
                    className={classNames("chain-sidebar", {
                      "chain-sidebar--active": activeChainId === chain.id,
                    })}
                    onClick={() => handleChainSelect(chain?.id || 0)}
                  >
                    <HexChain uri={getIconUri(chain.id)} />
                    <AnimatePresence mode="popLayout">
                      {!isMobileCollapsed && (
                        <motion.span
                          initial={!isDesktop ? { width: 0, opacity: 0 } : false}
                          animate={{ width: "auto", opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                          {chain.displayName}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              })
            : Array.from({ length: 7 }, (_, idx) => (
                <ChainSkeleton key={idx} />
              ))}
        </div>

        {/* Other */}
        {displayedOther.length > 0 && (
          <div className="chain-sidebar__contianer">
            <AnimatePresence mode="popLayout">
              {!isMobileCollapsed && (
                <motion.div
                  className="chain-sidebar__header"
                  initial={!isDesktop ? { height: 0, opacity: 0 } : false}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  Other Chains
                </motion.div>
              )}
            </AnimatePresence>
            {displayedOther.map((chain) => {
              if (!chain.id) return;
              return (
                <button
                  key={chain.id}
                  className={classNames("chain-sidebar", {
                    "chain-sidebar--active": activeChainId === chain.id,
                  })}
                  onClick={() => handleChainSelect(chain?.id || 0)}
                >
                  <HexChain uri={getIconUri(chain.id)} />
                  <AnimatePresence mode="popLayout">
                    {!isMobileCollapsed && (
                      <motion.span
                        initial={!isDesktop ? { width: 0, opacity: 0 } : false}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        {chain.displayName}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModalChains;

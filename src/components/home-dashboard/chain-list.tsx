"use client";

import classNames from "classnames";
import { getIconUri } from "@/helpers/get-icon-uri";
import ChainSkeleton from "../modal/chain-skeleton";
import { HexChain } from "../icons";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useChainsData } from "@/hooks/useChains";

type Props = {
  isChart?: boolean;
  chainId: number;
  setChainId: Dispatch<SetStateAction<number>>;
};

const ChainList = ({ isChart, chainId, setChainId }: Props) => {
  const [isShowAll, setIsShowAll] = useState(false);

  const {
    isLoading: isLoadingChains,
    // isLoaded: isLoadedChains,
    // error: chainsError,
    // chains,
    featuredChains,
    otherChains,
    solanaChain,
    baseChain,
    loadChains,
    ethereumChain,
  } = useChainsData();

  useEffect(() => {
    loadChains();
  }, [loadChains]);

  const allChains = useMemo(() => {
    if (
      !baseChain ||
      !solanaChain ||
      featuredChains.length === 0 ||
      otherChains.length === 0
    )
      return [];

    const filteredFeatured = featuredChains.filter(
      (c) => c.id !== baseChain.id && c.id !== solanaChain.id
    );

    return [baseChain, solanaChain, ...filteredFeatured, ...otherChains];
  }, [baseChain, solanaChain, featuredChains, otherChains]);

  const allChainIds = useMemo(
    () =>
      [solanaChain?.id, baseChain?.id, ethereumChain?.id].filter(
        Boolean
      ) as number[],
    [solanaChain, baseChain, ethereumChain]
  );

  return (
    <>
      <button
        className={classNames("chain-sidebar", {
          "chain-sidebar--active": chainId === 0,
        })}
        onClick={() => setChainId(0)}
      >
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

        <span>Show All</span>
      </button>
      {allChains.length > 0 && !isLoadingChains
        ? (isShowAll || isChart ? allChains : allChains.slice(0, 13)).map(
            (chain) => {
              if (!chain.id) return;
              return (
                <button
                  disabled={isLoadingChains}
                  key={chain.id}
                  className={classNames("chain-sidebar", {
                    "chain-sidebar--active": chainId === chain.id,
                  })}
                  onClick={() => setChainId(chain?.id || 8453)}
                >
                  <HexChain uri={getIconUri(chain.id)} />
                  <span>{chain.displayName}</span>
                </button>
              );
            }
          )
        : Array.from({ length: 13 }, (_, idx) => <ChainSkeleton key={idx} index={idx} />)}
      {!isChart && (
        <button
          onClick={() => setIsShowAll(!isShowAll)}
          className="dashboard-bottom-chains__all"
        >
          {!isShowAll ? "Show All" : "Show Less"}
        </button>
      )}
    </>
  );
};

export default ChainList;

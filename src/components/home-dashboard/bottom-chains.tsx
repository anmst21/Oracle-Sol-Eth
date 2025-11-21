import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useChainsData } from "@/hooks/useChains";
import classNames from "classnames";
import { getIconUri } from "@/helpers/get-icon-uri";
import ChainSkeleton from "../modal/chain-skeleton";
import { HexChain } from "../icons";

const DashboardBottomChains = ({
  chainId,
  setChainId,
}: {
  chainId: number;
  setChainId: Dispatch<SetStateAction<number>>;
}) => {
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

  // console.log({
  //   isLoadingChains,
  //   isLoadedChains,
  //   chainsError,
  //   featuredChains,
  //   otherChains,
  // });

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
    <div className="dashboard-bottom-chains">
      <div className="dashboard-bottom-chart__header">
        <div className="dashboard-bottom-chart__header__badge">Sort</div>
        <div className="dashboard-bottom-chart__header__subheader">
          Chain Overview
        </div>
      </div>
      <p>
        Analyze chain-level liquidity flow and transaction volume. Select a
        network to break down how its USD activity evolves over time.
      </p>
      <div className="dashboard-bottom-chains__list">
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
          ? (isShowAll ? allChains : allChains.slice(0, 17)).map((chain) => {
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
            })
          : Array.from({ length: 30 }, (_, idx) => <ChainSkeleton key={idx} />)}
        <button
          onClick={() => setIsShowAll(!isShowAll)}
          className="dashboard-bottom-chains__all"
        >
          {!isShowAll ? "Show All" : "Show Less"}
        </button>
      </div>
    </div>
  );
};

export default DashboardBottomChains;

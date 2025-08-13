import React, { useCallback, useMemo } from "react";
import { HexChain, InputCross } from "../icons";
import classNames from "classnames";
import { RelayChain } from "@/types/relay-query-chain-type";
import { getIconUri } from "@/helpers/get-icon-uri";
import SkeletonLoaderWrapper from "../skeleton";
import ChainSkeleton from "./chain-skeleton";
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
}: Props) => {
  // Combine your “all‐chain” icons
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

  return (
    <div className="modal-chains">
      {/* Search input */}
      {!disableSearch && (
        <div className="chain-sidebar__contianer">
          <label className="chain-sidebar__input">
            <input
              disabled={isLoadingChains}
              type="text"
              placeholder="Enter name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {searchTerm.length > 0 && (
              <button
                onClick={() => setSearchTerm("")}
                className="chain-sidebar__input__abandon"
              >
                <InputCross />
              </button>
            )}
          </label>
        </div>
      )}
      <div className="modal-chains__scroll">
        {/* “All Chains” button */}
        <div className="chain-sidebar__contianer">
          <button
            className={classNames("chain-sidebar", {
              "chain-sidebar--active": activeChainId === 0,
            })}
            onClick={() => setActiveChainId(0)}
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
            <SkeletonLoaderWrapper
              radius={2}
              height={24}
              width={"auto"}
              isLoading={false}
              flex
            >
              <span>All Chains</span>
            </SkeletonLoaderWrapper>
          </button>
        </div>

        {/* Featured */}

        <div className="chain-sidebar__contianer">
          <div className="chain-sidebar__header">Featured Chains</div>
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
                    onClick={() => setActiveChainId(chain?.id || 0)}
                  >
                    <HexChain uri={getIconUri(chain.id)} />
                    <span>{chain.displayName}</span>
                  </button>
                );
              })
            : Array.from({ length: 7 }, (_, idx) => (
                <ChainSkeleton key={idx} />
              ))}
          {/* {Array.from({ length: 7 }, (_, idx) => (
            <ChainSkeleton key={idx} />
          ))} */}
        </div>

        {/* Other */}
        {displayedOther.length > 0 && (
          <div className="chain-sidebar__contianer">
            <div className="chain-sidebar__header">Other Chains</div>
            {displayedOther.map((chain) => {
              if (!chain.id) return;
              return (
                <button
                  key={chain.id}
                  className={classNames("chain-sidebar", {
                    "chain-sidebar--active": activeChainId === chain.id,
                  })}
                  onClick={() => setActiveChainId(chain?.id || 0)}
                >
                  <HexChain uri={getIconUri(chain.id)} />
                  <span>{chain.displayName}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalChains;

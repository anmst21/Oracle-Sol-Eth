import React, { useCallback, useState } from "react";
import { HexChain, ModalChain } from "../icons";
import classNames from "classnames";
import { RelayChain } from "@reservoir0x/relay-sdk";
type Props = {
  activeChainId: number;
  setActiveChainId: (value: number) => void;
  featuredChains: RelayChain[];
  otherChains: RelayChain[];
};

const ModalChains = ({
  setActiveChainId,
  activeChainId,
  featuredChains,
  otherChains,
}: Props) => {
  const [showAll, setShowAll] = useState(false);

  const chainsToShow = showAll
    ? [...featuredChains, ...otherChains]
    : featuredChains;

  const setActiveId = useCallback(
    (value: number) => {
      setActiveChainId(value);
    },
    [setActiveChainId]
  );
  return (
    <div className="modal-chains">
      <button
        className={classNames("chain-sidebar", {
          "chain-sidebar--active": activeChainId === 0,
        })}
        onClick={() => setActiveId(0)}
      >
        <ModalChain />
        <span>All Chains</span>
      </button>
      {chainsToShow.map((chain) => {
        return (
          <button
            className={classNames("chain-sidebar", {
              "chain-sidebar--active": activeChainId === chain.id,
            })}
            onClick={() => setActiveId(chain.id)}
            key={chain.id}
          >
            {chain.icon?.squaredLight && (
              <HexChain uri={chain.icon?.squaredLight} />
              //   <Image
              //     alt={`${chain.displayName} Logo`}
              //     width={24}
              //     height={24}
              //     src={chain.icon?.squaredDark}
              //   />
            )}
            <span>{chain.displayName}</span>
          </button>
        );
      })}
      <button onClick={() => setShowAll(!showAll)}>
        Show {showAll ? "less" : "more"}
      </button>
    </div>
  );
};

export default ModalChains;

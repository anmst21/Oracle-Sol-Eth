"use client";

import React, { useEffect, useState } from "react";
import { HexChain, HistorySortEnable, HistorySortDisable } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import Image from "next/image";
import { queryRequests, useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayTransaction } from "@/types/relay-transaction";
import { useActiveWallet } from "@/context/ActiveWalletContext";
import { truncateAddress } from "@/helpers/truncate-address";
import HistoryItem from "./history-item";

const History = () => {
  const [transactions, setTransactions] = useState<RelayTransaction[]>([]);
  const [continuation, setContinuation] = useState<string | undefined>(
    undefined
  );

  const { chains, isLoading } = useRelayChains();

  const { activeWallet } = useActiveWallet();

  const chainId =
    activeWallet?.type === "ethereum"
      ? Number(activeWallet.chainId.split(":")[1])
      : 792703809;

  const chainItem = chains?.find((chain) => chain.id === chainId);

  console.log({ transactions, continuation, activeWallet });

  useEffect(() => {
    const getRequests = async () => {
      const res = await queryRequests("https://api.relay.link", {
        user: activeWallet?.address,
        chainId: String(chainId),
      });

      setTransactions(res.requests as RelayTransaction[]);
      setContinuation(res.continuation);
    };

    if (activeWallet?.address && chainId) {
      getRequests();
    }
  }, [activeWallet?.address, chainId]);

  return (
    <div className="history-component">
      <div className="history-sort">
        <div className="history-sort__title">
          <span>Sorted By:</span>
        </div>
        <button className="history-sort__network">
          <div className="history-sort__icon">
            <HexChain
              width={20}
              uri={!isLoading ? getIconUri(1) : undefined}
              question={isLoading}
            />
          </div>
          <div className="history-sort__value">
            <span>{chainItem?.displayName}</span>
          </div>
        </button>
        <button className="history-sort__address">
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
      <div className="history-transactions">
        {transactions.map((tx, i) => {
          return <HistoryItem status={tx.status} txAdderss={tx.id} key={i} />;
        })}
      </div>
    </div>
  );
};

export default History;

//  query?: {
//                     limit?: string;
//                     continuation?: string;
//                     user?: string;
//                     hash?: string;
//                     originChainId?: string;
//                     destinationChainId?: string;
//                     privateChainsToInclude?: string;
//                     id?: string;
//                     startTimestamp?: number;
//                     endTimestamp?: number;
//                     startBlock?: number;
//                     endBlock?: number;
//                     /** @description Get all requests for a single chain in either direction. Setting originChainId and/or destinationChainId will override this parameter. */
//                     chainId?: string;
//                     referrer?: string;
//                     sortBy?: "createdAt" | "updatedAt";
//                     sortDirection?: "asc" | "desc";
//                 };

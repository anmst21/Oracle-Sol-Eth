import React, { useMemo } from "react";
import { getIconUri } from "@/helpers/get-icon-uri";
import { HexChain, StepUri } from "../icons";
import { Tx } from "./types";
import { RelayChain } from "@reservoir0x/relay-sdk";
import { truncateAddress } from "@/helpers/truncate-address";
import Link from "next/link";
type Props = {
  transactions: Tx[];
  chains: (RelayChain & Required<Pick<RelayChain, "viemChain">>)[] | undefined;
};

const TxBlock = ({ transactions, chains }: Props) => {
  const chain = useMemo(
    () => chains?.find((chain) => chain.id === transactions[0].chainId),
    [chains, transactions]
  );

  return (
    <div className="tx-block">
      <div className="tx-block__header">
        <HexChain uri={getIconUri(transactions[0].chainId)} />
        <span>{chain?.displayName} Tx</span>
      </div>

      <div className="tx-block__main">
        {transactions.map((tx, i) => (
          <div className="tx-block__item" key={i}>
            <div className="tx-block__item__text">
              <span>{truncateAddress(tx.txHash, 8)}</span>
            </div>
            <Link
              target="_blank"
              href={chain?.explorerUrl + "/tx/" + tx.txHash}
              className="tx-block__item__link"
            >
              <StepUri />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TxBlock;

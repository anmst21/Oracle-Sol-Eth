import React from "react";
import { HexChain, UserQuestion } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import Image from "next/image";
import GreenDot from "../green-dot";

type Props = {
  amountFormatted: string | undefined;
  ticker: string | undefined;
  uri: string | undefined;
  chainId: number | undefined;
  chainName: string | undefined;
  type: "from" | "to";
};

const TransactionHeader = ({
  chainName,
  chainId,
  type,
  ticker,
  uri,
  amountFormatted,
}: Props) => {
  const amount = amountFormatted ? Number(amountFormatted) : 0;

  const amt = amount > 1 ? amount.toFixed(2) : amount;

  const [int, dec] = amt.toString().split(".");

  return (
    <div className="transaction-header">
      <div className="transaction-header__top">
        <div className="transaction-header__top__chain">
          <div className="transaction-header__top__chain__hex">
            <HexChain width={24} uri={getIconUri(chainId || 1)} />
          </div>
          <span>{chainName}</span>
        </div>
        <div className="transaction-header__whitespace" />
        <div className="transaction-header__top__type">
          <span>{type.toUpperCase()}</span>
        </div>
      </div>
      <div className="transaction-header__main">
        <div className="transaction-header__main__image">
          <div className="user-placeholder">
            {uri ? (
              <Image
                src={uri}
                width={24}
                height={24}
                alt={`${ticker} token input`}
              />
            ) : (
              <UserQuestion />
            )}
          </div>
        </div>
        <div className="transaction-header__main__value">
          <span>
            <GreenDot int={int} dec={dec} />
          </span>
        </div>
        <div className="transaction-header__main__name">
          <span>{ticker}</span>
        </div>
        <div className="transaction-header__whitespace" />
      </div>
    </div>
  );
};

export default TransactionHeader;

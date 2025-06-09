import React from "react";
import { TxStatus } from "./types";
import { ModalInfo, StepUri, TxSwap, HexChain, UserQuestion } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import Image from "next/image";
import Link from "next/link";
import { truncateAddress } from "@/helpers/truncate-address";
import CopyBtn from "./copy-btn";
import GreenDot from "../green-dot";

type Props = {
  type: "fill" | "deposit";
  amountFormatted: string | undefined;
  ticker: string | undefined;
  uri: string | undefined;
  chainId: number | undefined;
  chainName: string | undefined;
  userAddress: string | undefined;
  status: TxStatus;
  txHash: string | undefined;
  explorerUri: string | undefined;
  timestamp: number | undefined;
  currencyAddress: string | undefined;
};

const TransactionInfo = ({
  type,
  status,
  timestamp,
  amountFormatted,
  ticker,
  chainId,
  explorerUri,
  chainName,
  uri,
  currencyAddress,
  userAddress,
  txHash,
}: Props) => {
  const dt = new Date((timestamp ?? Math.floor(Date.now() / 1000)) * 1000);

  const dateStr = dt.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const timeStr = dt.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const ampmStr = dt.getHours() >= 12 ? "PM" : "AM";

  const tzParts = dt
    .toLocaleTimeString("en-US", {
      timeZoneName: "short",
    })
    .split(" ");
  const tzStr = tzParts[tzParts.length - 1];

  const timeParts = [dateStr, timeStr, ampmStr, tzStr];

  const ammountNumber = Number(amountFormatted);
  const ammount = ammountNumber > 1 ? ammountNumber.toFixed(2) : ammountNumber;

  const [int, dec] = String(ammount).split(".");
  console.log("explorerUri", explorerUri);
  return (
    <div className="transaction-info">
      {type === "deposit" && (
        <div className="transaction-info__swap">
          <TxSwap />
        </div>
      )}
      <div className="transaction-info__header">
        <ModalInfo /> <span>{type}</span>
        <div className="transaction-info__header__status">{status}</div>
      </div>
      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Amount</div>
        <div className="transaction-info__item__value">
          <GreenDot int={int} dec={dec} />
        </div>
        <div className="transaction-info__item__prefix">{ticker}</div>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Chain</div>

        <div className="transaction-info__item__prefix tx-icon">
          <HexChain
            question={!chainId}
            uri={chainId ? getIconUri(chainId) : undefined}
            width={20}
          />
        </div>
        <div className="transaction-info__item__prefix">{chainName}</div>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Currency</div>
        <div className="transaction-info__item__button tx-icon">
          <div className="user-placeholder">
            {uri ? (
              <Image
                src={uri}
                width={20}
                height={20}
                alt={`${ticker} token input`}
              />
            ) : (
              <UserQuestion />
            )}
          </div>
        </div>

        <div className="transaction-info__item__button">{ticker}</div>
        <Link
          target="_blank"
          href={explorerUri + "/address/" + currencyAddress}
          className="transaction-info__item__button tx-icon"
        >
          <StepUri />
        </Link>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">
          {type === "deposit" ? "Sender" : "Recipient"} Address
        </div>
        <div className="transaction-info__item__button">
          {userAddress ? truncateAddress(userAddress) : "0xXX...XXXX"}
        </div>
        <Link
          target="_blank"
          href={explorerUri + "/address/" + userAddress}
          className="transaction-info__item__button tx-icon"
        >
          <StepUri />
        </Link>
        <CopyBtn value={userAddress} />
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Transaction Hash</div>
        <div className="transaction-info__item__button">
          {txHash ? truncateAddress(txHash, 8) : "0xXXXXXXXXXX...XXXX"}
        </div>
        <Link
          target="_blank"
          href={explorerUri + "/tx/" + txHash}
          className="transaction-info__item__button tx-icon"
        >
          <StepUri />
        </Link>
        <CopyBtn value={txHash} />
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Timestamp</div>
        {timeParts.map((part, i) => {
          return (
            <div key={i} className="transaction-info__item__prefix">
              {part}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionInfo;

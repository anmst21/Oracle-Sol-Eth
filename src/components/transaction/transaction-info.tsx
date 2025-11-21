import React from "react";
import { TxStatus } from "./types";
import { ModalInfo, StepUri, TxSwap, HexChain, UserQuestion } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import Image from "next/image";
import Link from "next/link";
import { truncateAddress } from "@/helpers/truncate-address";
import CopyBtn from "./copy-btn";
import GreenDot from "../green-dot";
import classNames from "classnames";
import SkeletonLoaderWrapper from "../skeleton";

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
  // console.log("explorerUri", explorerUri);

  const isLoading =
    status === "pending" || status === "waiting" || status === "delayed";

  const isLoadingFill = isLoading && type === "fill";

  return (
    <div className="transaction-info">
      {type === "deposit" && (
        <div className="transaction-info__swap">
          <TxSwap />
        </div>
      )}
      <div className="transaction-info__header">
        <ModalInfo /> <span>{type}</span>
        <div
          className={classNames("transaction-info__header__status", {
            "transaction-info__header__status--success": status === "success",
            "transaction-info__header__status--normal": isLoading,
            "transaction-info__header__status--error":
              status === "refund" || status === "failure",
          })}
        >
          {status}
        </div>
      </div>
      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Amount</div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoadingFill}
          flex={isLoadingFill}
        >
          <div className="transaction-info__item__value">
            <GreenDot int={int} dec={dec} />
          </div>
          <div className="transaction-info__item__prefix">{ticker}</div>
        </SkeletonLoaderWrapper>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Chain</div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoadingFill}
          flex={isLoadingFill}
        >
          <div className="transaction-info__item__prefix tx-icon tx-events">
            <HexChain
              question={!chainId}
              uri={chainId ? getIconUri(chainId) : undefined}
              width={20}
            />
          </div>
          <div className="transaction-info__item__prefix">{chainName}</div>
        </SkeletonLoaderWrapper>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Currency</div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoadingFill}
          flex={isLoadingFill}
        >
          <div className="transaction-info__item__button tx-icon tx-events">
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
        </SkeletonLoaderWrapper>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">
          {type === "deposit" ? "Sender" : "Recipient"} Address
        </div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoadingFill}
          flex={isLoadingFill}
        >
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
        </SkeletonLoaderWrapper>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Transaction Hash</div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoadingFill}
          flex={isLoadingFill}
        >
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
        </SkeletonLoaderWrapper>
      </div>

      <div className="transaction-info__item">
        <div className="transaction-info__item__key">Timestamp</div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoadingFill}
          flex={isLoadingFill}
        >
          {timeParts.map((part, i) => {
            return (
              <div key={i} className="transaction-info__item__prefix">
                {part}
              </div>
            );
          })}
        </SkeletonLoaderWrapper>
      </div>
    </div>
  );
};

export default TransactionInfo;

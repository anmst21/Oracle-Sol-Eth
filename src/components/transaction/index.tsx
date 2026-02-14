import React from "react";
import TransactionHeader from "./transaction-header";
import TransactionInfo from "./transaction-info";
import TransactionRoute from "./transaction-route";
import { queryRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayTransaction } from "@/types/relay-transaction";
import { RelayChainFetch } from "@/types/relay-chain";
import { notFound } from "next/navigation";
import { HeaderCross, TxSwap } from "../icons";
import classNames from "classnames";
import { formatUnits } from "viem";
import TransactionTime from "./transaction-time";

const Transaction = async ({
  transaction,
}: {
  transaction: RelayTransaction;
}) => {
  let chains: RelayChainFetch[] | undefined;
  try {
    const { chains: c } = await queryRelayChains("https://api.relay.link", {});
    chains = c;
  } catch (err) {
    console.error("Error fetching transaction", err);
    // any fetch error → 404
    return notFound();
  }

  if (!chains) {
    // no transaction found → 404
    return notFound();
  }

  const currencyIn = transaction.data?.metadata?.currencyIn;
  const currencyOut = transaction.data?.metadata?.currencyOut;

  const fromChainData = chains.find(
    (chain) => chain.id === currencyIn?.currency?.chainId
  );
  const toChainData = chains.find(
    (chain) => chain.id === currencyOut?.currency?.chainId
  );

  const inTx = transaction.data?.inTxs?.[0];
  const outTx = transaction.data?.outTxs?.[0];

  const inTxHash = inTx?.hash;
  const outTxHash = outTx?.hash ? outTx.hash : inTx?.hash;

  const totalAppFees = transaction.data?.appFees
    ? transaction.data?.appFees.reduce((sum, { amount }) => {
        const n = parseFloat(amount as string);
        return sum + (isNaN(n) ? 0 : n);
      }, 0)
    : undefined;

  // console.log(
  //   "fromChainData",
  //   transaction.data?.fees?.gas,
  //   fromChainData?.currency?.decimals
  // );

  const isLoading =
    transaction.status === "pending" ||
    transaction.status === "waiting" ||
    transaction.status === "delayed";

  return (
    <div className="transaction">
      <div className="transaction__header">
        <div className="transaction__header__left">
          <HeaderCross />
        </div>
        <span className="transaction__header__details">
          Transaction Details
        </span>
        <div className="transaction__divider" />
        <div
          className={classNames("transaction__status", {
            "transaction__status--success": transaction.status === "success",
            "transaction__status--normal": isLoading,
            "transaction__status--error":
              transaction.status === "refund" ||
              transaction.status === "failure",
          })}
        >
          <span>{transaction.status?.toUpperCase()}</span>
        </div>
        <div className="transaction__header__right">
          <HeaderCross />
        </div>
      </div>
      <div className="transaction__info">
        <div className="transaction__headers">
          <TransactionHeader
            amountFormatted={currencyIn?.amountFormatted}
            ticker={currencyIn?.currency?.symbol}
            uri={currencyIn?.currency?.metadata?.logoURI}
            chainId={currencyIn?.currency?.chainId}
            chainName={fromChainData?.displayName}
            type="from"
          />
          <TransactionInfo
            userAddress={transaction.user}
            type="deposit"
            status={transaction.status}
            txHash={inTxHash}
            explorerUri={fromChainData?.explorerUrl}
            timestamp={inTx?.timestamp}
            amountFormatted={currencyIn?.amountFormatted}
            ticker={currencyIn?.currency?.symbol}
            uri={currencyIn?.currency?.metadata?.logoURI}
            chainId={currencyIn?.currency?.chainId}
            chainName={fromChainData?.displayName}
            currencyAddress={currencyIn?.currency?.address}
          />
          <TransactionRoute
            isLoading={isLoading}
            hideFill={
              currencyIn?.currency?.chainId === currencyOut?.currency?.chainId
            }
            depositChainName={fromChainData?.displayName}
            depositCurrencyTicker={fromChainData?.currency?.symbol}
            depositGasValue={
              inTx?.fee && fromChainData?.currency?.decimals
                ? formatUnits(
                    BigInt(inTx?.fee),
                    fromChainData?.currency?.decimals
                  )
                : "0.0"
            }
            fillChainName={toChainData?.displayName}
            fillCurrencyTicker={toChainData?.currency?.symbol}
            fillGasValue={
              transaction.data?.fees?.gas && fromChainData?.currency?.decimals
                ? formatUnits(
                    BigInt(transaction.data?.fees?.gas),
                    fromChainData?.currency?.decimals
                  )
                : "0.0"
            }
          />
        </div>
        <div className="transaction__info__swap">
          <TxSwap />
        </div>
        <div className="transaction__main">
          <TransactionHeader
            isLoading={isLoading}
            amountFormatted={currencyOut?.amountFormatted}
            ticker={currencyOut?.currency?.symbol}
            uri={currencyOut?.currency?.metadata?.logoURI}
            chainId={currencyOut?.currency?.chainId}
            chainName={toChainData?.displayName}
            type="to"
          />
          <TransactionInfo
            userAddress={transaction.recipient}
            type="fill"
            status={transaction.status}
            txHash={outTxHash}
            explorerUri={toChainData?.explorerUrl}
            timestamp={outTx?.timestamp ? outTx.timestamp : inTx?.timestamp}
            amountFormatted={currencyOut?.amountFormatted}
            ticker={currencyOut?.currency?.symbol}
            uri={currencyOut?.currency?.metadata?.logoURI}
            chainId={currencyOut?.currency?.chainId}
            chainName={toChainData?.displayName}
            currencyAddress={currencyOut?.currency?.address}
          />
          <TransactionTime
            isLoading={isLoading}
            relayFeeValue={
              transaction.data?.fees?.fixed &&
              transaction.data?.feeCurrencyObject?.decimals
                ? formatUnits(
                    BigInt(transaction.data?.fees?.fixed),
                    transaction.data?.feeCurrencyObject?.decimals
                  )
                : "0.0"
            }
            appFeeValue={
              totalAppFees && transaction.data?.feeCurrencyObject?.decimals
                ? formatUnits(
                    BigInt(totalAppFees),
                    transaction.data?.feeCurrencyObject?.decimals
                  )
                : "0.0"
            }
            appFeeTicker={transaction.data?.feeCurrencyObject?.symbol}
            timeEstimate={transaction.data?.timeEstimate}
          />
        </div>
      </div>
    </div>
  );
};

export default Transaction;

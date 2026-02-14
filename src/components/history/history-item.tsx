import {
  ClockInfo,
  HistoryCalendar,
  HistoryFrom,
  HistoryTo,
  HistorySender,
  SwapIcon,
  StepUri,
  HexChain,
} from "../icons";
import classNames from "classnames";
import GreenDot from "../green-dot";
import { formatAmount } from "@/helpers/format-amount";
import { TxStatus } from "../transaction/types";
import { truncateAddress } from "@/helpers/truncate-address";
import Link from "next/link";
import { RelayChain } from "@reservoir0x/relay-sdk";
import { CurrencyIn } from "@/types/relay-transaction";
import { parseDateHistory } from "@/helpers/parse-date-history";
import Image from "next/image";
import { getIconUri } from "@/helpers/get-icon-uri";

type Props = {
  txAdderss: string | undefined;
  status: TxStatus;
  fromChainData:
    | (RelayChain & Required<Pick<RelayChain, "viemChain">>)
    | undefined;
  toChainData:
    | (RelayChain & Required<Pick<RelayChain, "viemChain">>)
    | undefined;
  timestamp: string | undefined;
  currencyIn: CurrencyIn | undefined;
  currencyOut: CurrencyIn | undefined;
  sender: string | undefined;
  recipient: string | undefined;
};

function HistoryItem({
  status,
  txAdderss,
  fromChainData,
  toChainData,
  timestamp,
  currencyIn,
  currencyOut,
  sender,
  recipient,
}: Props) {
  //   const { chains, isLoading } = useRelayChains();
  const isLoading =
    status === "pending" || status === "waiting" || status === "delayed";

  const dateArray = parseDateHistory(timestamp);

  // console.log({
  //   status,
  //   txAdderss,
  //   fromChainData,
  //   toChainData,
  //   dateArray,
  //   currencyIn,
  //   currencyOut,
  // });

  const [intIn, decIn] = formatAmount(currencyIn?.amountFormatted).split(".");
  const [intOut, decOut] = formatAmount(currencyOut?.amountFormatted).split(".");

  // const propsData = [{ icon: <HistorySender />, key: "Sender" }];
  return (
    <div className="history-item">
      <div className="history-item__header">
        <div className="history-item__header__tx">
          {txAdderss && (
            <Link
              href={`/transaction/${txAdderss}`}
              target="_blank"
              className="history-item__transaction"
            >
              <span>{truncateAddress(txAdderss, 8)}</span>
              <StepUri />
            </Link>
          )}
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
        <Link
          href={`/swap?sellTokenChain=${currencyIn?.currency?.chainId}&sellTokenAddress=${currencyIn?.currency?.address}&buyTokenChain=${currencyOut?.currency?.chainId}&buyTokenAddress=${currencyOut?.currency?.address}`}
          className="history-item__header__swap"
        >
          <SwapIcon />
        </Link>
      </div>
      {sender && (
        <div className="history-item__section">
          <div className="history-item__key">
            <HistorySender />
            <span>Sender</span>
          </div>
          <Link
            href={fromChainData?.explorerUrl + "/address/" + sender}
            target="_blank"
            className="history-item__value"
          >
            {currencyIn?.currency?.chainId && (
              <HexChain
                width={16}
                uri={getIconUri(currencyIn?.currency?.chainId)}
              />
            )}
            <span>{truncateAddress(sender)}</span>
          </Link>
        </div>
      )}
      {currencyIn && (
        <div className="history-item__section">
          <div className="history-item__key">
            <HistoryFrom />
            <span>From</span>
          </div>

          <Link
            href={
              fromChainData?.explorerUrl +
              "/address/" +
              currencyIn?.currency?.address
            }
            target="_blank"
            className="history-item__value"
          >
            {currencyIn?.currency?.metadata?.logoURI && (
              <Image
                width={16}
                height={16}
                alt="From coin logo"
                src={currencyIn?.currency?.metadata?.logoURI}
              />
            )}
            <span>
              <span className="white">
                <GreenDot int={intIn} dec={decIn} />
              </span>
              <span>{currencyIn?.currency?.symbol}</span>
            </span>
          </Link>
        </div>
      )}
      {recipient && (
        <div className="history-item__section">
          <div className="history-item__key">
            <HistorySender />
            <span>Recipient</span>
          </div>
          <Link
            href={toChainData?.explorerUrl + "/address/" + sender}
            target="_blank"
            className="history-item__value"
          >
            {currencyOut?.currency?.chainId && (
              <HexChain
                width={16}
                uri={getIconUri(currencyOut?.currency?.chainId)}
              />
            )}
            <span>{truncateAddress(recipient)}</span>
          </Link>
        </div>
      )}
      {currencyOut && (
        <div className="history-item__section">
          <div className="history-item__key">
            <HistoryTo />
            <span>To</span>
          </div>

          <Link
            href={
              fromChainData?.explorerUrl +
              "/address/" +
              currencyOut?.currency?.address
            }
            target="_blank"
            className="history-item__value"
          >
            {currencyOut?.currency?.metadata?.logoURI && (
              <Image
                width={16}
                height={16}
                alt="From coin logo"
                src={currencyOut?.currency?.metadata?.logoURI}
              />
            )}
            <span>
              <span className="white">
                <GreenDot int={intOut} dec={decOut} />
              </span>
              <span>{currencyOut?.currency?.symbol}</span>
            </span>
          </Link>
        </div>
      )}
      <div className="history-item__section">
        <div className="history-item__time">
          <div className="history-item__time__icon">
            <HistoryCalendar />
          </div>
          <div className="history-item__value">
            <span>
              <span className="white">{dateArray[0]}</span>
              <span>{dateArray[1]}</span>
            </span>
          </div>
        </div>
        <div className="history-item__time">
          <div className="history-item__time__icon">
            <ClockInfo />
          </div>
          <div className="history-item__value">
            <span>
              <span className="white">{dateArray[2]}</span>
              <span>{dateArray[3]}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryItem;

import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import {
  ClockInfo,
  HistoryCalendar,
  HistoryFrom,
  HistoryTo,
  HistoryRecipient,
  HistorySender,
  SwapIcon,
  SwapCopy,
  StepUri,
} from "../icons";
import classNames from "classnames";
import { TxStatus } from "../transaction/types";
import { truncateAddress } from "@/helpers/truncate-address";
import Link from "next/link";

type Props = {
  txAdderss: string | undefined;
  status: TxStatus;
};

function HistoryItem({ status, txAdderss }: Props) {
  //   const { chains, isLoading } = useRelayChains();
  const isLoading =
    status === "pending" || status === "waiting" || status === "delayed";

  console.log({ status });
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
        <button className="history-item__header__swap">
          <SwapIcon />
        </button>
      </div>
    </div>
  );
}

export default HistoryItem;

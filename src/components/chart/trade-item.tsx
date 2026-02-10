import React from "react";
import { TradeItem as TradeItemType } from "@/types/trades-response";
import { isAddress } from "viem";
import { parseTimestampToArray } from "@/helpers/timestamp-to-array";
import { splitCompact } from "@/helpers/compact-formatter";
import Link from "next/link";
import { LinkIconChart } from "../icons";
import classNames from "classnames";

type Props = {
  item: TradeItemType;
  index: number;
  explorerUrl?: string | undefined;
};

function TradeItem({ index, item, explorerUrl }: Props) {
  //   item.attributes.block_timestamp

  //   item.attributes.kind

  //   item.attributes.price_from_in_currency_token

  //   item.attributes.price_from_in_usd

  //   item.attributes.from_token_amount

  // item.attributes.volume_in_usd

  // item.attributes.tx_from_address

  // item.attributes.tx_hash

  const mainNetworkType = isAddress(item.attributes.from_token_address)
    ? "ETH"
    : "SOL";

  const arrayTimestamp = parseTimestampToArray(item.attributes.block_timestamp);

  const priceNative = Number(item.attributes.price_from_in_currency_token);

  const priceFormatted =
    priceNative > 1 ? priceNative.toFixed(2) : priceNative.toFixed(6);

  const priceUsd = Number(item.attributes.price_from_in_usd);
  const priceUsdFormatted = splitCompact(priceUsd || 0);

  const amount = Number(item.attributes.to_token_amount);
  const amountFormatted = amount > 1 ? amount.toFixed(2) : amount.toFixed(6);
  const amountSplit = splitCompact(amount);

  const value = Number(item.attributes.volume_in_usd);
  const valueFormatted = value > 1 ? value.toFixed(2) : value.toFixed(6);
  const valueSplit = splitCompact(value);

  return (
    <tr className="trade-item">
      <td className="trade-item__index">
        <div>
          <span>{index}</span>
        </div>
      </td>
      <td className="trade-item__timestamp">
        <div className="trade-item__timestamp__wrapper">
          <span className="trade-item__timestamp__top">
            <span>{arrayTimestamp[0]}</span>
            {arrayTimestamp[1]}
          </span>
          <span className="trade-item__timestamp__bottom">
            <span>{arrayTimestamp[2]}</span>
            {arrayTimestamp[3]}
          </span>
        </div>
      </td>
      <td
        className={classNames("trade-item__kind", {
          "trade-item__kind--sell": item.attributes.kind === "sell",
        })}
      >
        <div className="trade-item__kind__block">
          <span>{item.attributes.kind}</span>
        </div>
      </td>
      <td className="trade-item__price">
        <div className="trade-item__price__wrapper">
          <span className="trade-item__price__wrapper__top">
            <span>{priceFormatted}</span>
            {mainNetworkType}
          </span>
          <span className="trade-item__price__wrapper__bottom">
            $
            <span>
              {priceUsd < 1000
                ? Number(item.attributes.price_from_in_usd).toFixed(6)
                : priceUsdFormatted[0]}
            </span>{" "}
            {priceUsd >= 1000 && priceUsdFormatted[1]}
          </span>
        </div>
      </td>
      <td className="trade-item__amount">
        <div className="trade-item__amount__wrapper">
          <span className="trade-item__amount__value">
            <span>{amount < 1000 ? amountFormatted : amountSplit[0]}</span>
            {amount >= 1000 && amountSplit[1]}
          </span>
        </div>
      </td>
      <td className="trade-item__value">
        <div className="trade-item__value__wrapper">
          <span className="trade-item__value__value">
            $<span>{value < 1000 ? valueFormatted : valueSplit[0]}</span>
            {value >= 1000 && valueSplit[1]}
          </span>
        </div>
      </td>
      <td className="trade-item__from">
        {explorerUrl ? (
          <Link
            href={explorerUrl + "/address/" + item.attributes.tx_from_address}
            target="_blank"
            className="trade-item__from__wrapper"
          >
            <span className="trade-item__from__value">
              {item.attributes.tx_from_address.slice(0, 8)}
            </span>
          </Link>
        ) : (
          <span className="trade-item__from__wrapper">
            <span className="trade-item__from__value">
              {item.attributes.tx_from_address.slice(0, 8)}
            </span>
          </span>
        )}
      </td>
      <td className="trade-item__transaction">
        {explorerUrl ? (
          <Link
            href={explorerUrl + "/tx/" + item.attributes.tx_hash}
            target="_blank"
          >
            <LinkIconChart />
          </Link>
        ) : (
          <span>
            <LinkIconChart />
          </span>
        )}
      </td>
    </tr>
  );
}

export default TradeItem;

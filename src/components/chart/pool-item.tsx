import React from "react";
import { type PoolItem } from "@/types/token-pools";
import Image from "next/image";
import { HexChain } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import { splitCompact } from "@/helpers/compact-formatter";
import { timeAgoShort } from "@/helpers/time-ago-short";
import { truncateAddress } from "@/helpers/truncate-address";
import Link from "next/link";
import { geckoPoolsBase } from "@/helpers/gecko-pools-base";
import { UnifiedToken } from "@/types/coin-types";
import ChangePercentage from "./change-percentage";
import classNames from "classnames";

type Props = {
  // tokenMeta: RelayTokenMeta | null;
  item: PoolItem;
  index: number;
  chainName: string | undefined;
  callback: () => void;
  isActive: boolean;
  activeToken: UnifiedToken | undefined;
  afterFdv?: React.ReactNode;
  children?: React.ReactNode;
};

const PoolItem = ({
  activeToken,
  item,
  index,
  chainName,
  callback,
  isActive,
  afterFdv,
  children,
}: Props) => {
  const [fromTicker, , toTicker] = (item.attributes.name ?? "").split(" ");

  const fdvUsd = splitCompact(Number(item.attributes.fdv_usd) || 0);
  const liquidity = splitCompact(Number(item.attributes.reserve_in_usd) || 0);
  const txns = splitCompact(
    Number(
      item.attributes.transactions.h24.buys +
        item.attributes.transactions.h24.sells
    ) || 0
  );

  const volume = splitCompact(Number(item.attributes.volume_usd.h24) || 0);
  const timeAgo = timeAgoShort(item.attributes.pool_created_at);

  const timeElapsed = [timeAgo.slice(0, -1), timeAgo.slice(-1)];
  const priceUsd = Number(item.attributes.token_price_usd);
  const tokenPriceUsd =
    priceUsd > 1 ? priceUsd.toFixed(2) : priceUsd.toFixed(6);
  return (
    <tr
      onClick={callback}
      className={classNames("trade-item pool-item", {
        "pool-item--active": isActive,
      })}
    >
      <td className="trade-item__index">
        <div>
          <span>{index}</span>
        </div>
      </td>
      <td>
        <div className="pool-item__pool">
          <div className="pool-item__pool__image">
            {activeToken && activeToken.logo && activeToken?.chainId && (
              <>
                <Image
                  width={32}
                  height={32}
                  alt={`${activeToken.name} logo`}
                  src={activeToken.logo}
                />
                <HexChain width={16} uri={getIconUri(activeToken?.chainId)} />
              </>
            )}
          </div>
          <div className="pool-item__pool__name">
            <div className="pool-item__pool__name__top">
              <span>{fromTicker}</span>
              <div>
                <span>{toTicker}</span>
              </div>
            </div>
            <Link
              href={
                geckoPoolsBase +
                "/" +
                chainName +
                "/pools/" +
                activeToken?.address
              }
              target="_blank"
              className="pool-item__pool__name__bottom"
            >
              <span>{truncateAddress(item.attributes.address)}</span>
            </Link>
          </div>
        </div>
      </td>
      <td className="pool-item__fdv">
        <div className="pool-item__fdv__container">
          <div className="pool-item__fdv__header">
            <span>
              $<span>{fdvUsd[0]}</span>
              {fdvUsd[1]}
            </span>
          </div>
          <div className="pool-item__fdv__bottom">
            <span>${tokenPriceUsd}</span>
          </div>
        </div>
      </td>
      {afterFdv}
      <td className="pool-item__created">
        <div>
          <span>{timeElapsed[0]}</span>
          {timeElapsed[1]}
        </div>
      </td>
      <ChangePercentage value={item.attributes.price_change_percentage.m5} />
      <ChangePercentage value={item.attributes.price_change_percentage.h1} />
      <ChangePercentage value={item.attributes.price_change_percentage.h6} />
      <ChangePercentage value={item.attributes.price_change_percentage.h24} />
      <td className="pool-item__liq">
        <div>
          <span>
            $<span>{liquidity[0]}</span>
            {liquidity[1]}
          </span>
        </div>
      </td>
      <td className="pool-item__txn">
        <div>
          <span>
            <span>{txns[0]}</span>
            {txns[1]}
          </span>
        </div>
      </td>
      <td className="pool-item__vol">
        <div>
          <span>
            $<span>{volume[0]}</span>
            {volume[1]}
          </span>
        </div>
      </td>
      {children}
    </tr>
  );
};

export default PoolItem;

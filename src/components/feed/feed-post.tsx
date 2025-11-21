import { FarcasterUser } from "@/types/farcaster-user";
import { EnrichedDexEntry, RelayTokenMeta } from "@/types/relay-token-meta";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { farcasterBase } from "@/helpers/farcaster-base";
import GreenDot from "../green-dot";
import {
  SwapIcon,
  FeedCalendar,
  ExplorerFeed,
  ArrowSmall,
  HexChain,
  FeedChange,
  CoinFade,
} from "../icons";
import { useRouter } from "next/navigation";
import { isoToUsParts } from "@/helpers/isoToUs";
import { getIconUri } from "@/helpers/get-icon-uri";
import { RelayChainFetch } from "@/types/relay-chain";
import classNames from "classnames";

type Props = {
  item: EnrichedDexEntry;
  fromMeta: RelayTokenMeta | null;
  toMeta: RelayTokenMeta | null;
  farcasterUser: FarcasterUser;
  chainItem: RelayChainFetch;
};

const FeedPost = ({
  item,
  fromMeta,
  toMeta,
  farcasterUser,
  chainItem,
}: Props) => {
  // console.log({ item, fromMeta, toMeta, farcasterUser, chainItem });

  const { push } = useRouter();

  const onSwapRedirect = () => {
    let route = "/swap?";

    if (fromMeta)
      route =
        route +
        `sellTokenChain=${item.chainId}&sellTokenAddress=${item.tokenFrom}`;
    if (toMeta)
      route =
        route +
        `${fromMeta ? "&" : ""}buyTokenChain=${item.chainId}
              &buyTokenAddress=${item.tokenTo}`;
    push(route);
  };

  const dateArray = isoToUsParts(item.chainTimestamp);

  const explorerName = chainItem?.explorerName;
  const explorerUri = chainItem?.explorerUrl;

  const fromTokenName = item.symbolFrom;
  const toTokenName = item.symbolTo;

  const fromTokenIcon = fromMeta?.metadata?.logoURI;
  const toTokenIcon = toMeta?.metadata?.logoURI;

  const fromTokenAmount = Number(item.tokenAmountFrom);
  const fromTokenUsdAmount = item.amountFromUsdAtTxnMoment;

  const toTokenAmount = Number(item.tokenAmountTo);
  // const toTokenUsdAmount = item.amountToUsdAtTxnMoment;
  const toTokenAmountDisplay =
    toTokenAmount > 1 ? toTokenAmount.toFixed(2) : toTokenAmount.toFixed(6);

  const chainId = item.chainId;

  const fromDisplayType = fromTokenUsdAmount === "0" ? "crypto" : "fiat";

  const fromDisplayAmount =
    fromDisplayType === "fiat"
      ? fromTokenUsdAmount
      : fromTokenAmount > 1
        ? fromTokenAmount.toFixed(2)
        : fromTokenAmount.toFixed(6);

  const [fromInt, fromDec] = fromDisplayAmount.split(".");
  const [toInt, toDec] = toTokenAmountDisplay.split(".");

  const dexName = item.dex;

  return (
    <div className="feed-post">
      <div className="feed-post__header">
        <div className="feed-post__header__pfp">
          <Image
            width={24}
            height={24}
            src={farcasterUser.pfp_url}
            alt={`${farcasterUser.display_name} pfp`}
          />
        </div>
        <Link
          href={farcasterBase + farcasterUser.username}
          target="_blank"
          className="feed-post__header__username"
        >
          <span>@{farcasterUser.username}</span>
        </Link>
        <button onClick={onSwapRedirect} className="feed-post__header__swap">
          <SwapIcon />
          Swap
        </button>
      </div>
      <div className="feed-post__main">
        <div className="feed-post__left">
          <div className="feed-post__main">
            <div className="feed-post__section">
              <div className="feed-post__section__header">
                <span>SWAPPED</span>
                <ArrowSmall />
              </div>
              <Link
                target="_blank"
                href={explorerUri + "/token/" + item.tokenFrom}
                className="feed-post__section__main"
              >
                <span className="feed-post__section__main__name">
                  {fromDisplayType === "fiat" && "$"}
                  <span>
                    <GreenDot int={fromInt} dec={fromDec} />
                  </span>
                  {fromDisplayType !== "fiat" && fromTokenName}
                </span>
                <div className="token-to-buy__token__icon">
                  {chainId && <HexChain width={17} uri={getIconUri(chainId)} />}
                  <div className="user-placeholder user-placeholder--md">
                    {fromTokenIcon ? (
                      <Image
                        src={fromTokenIcon}
                        width={17}
                        height={17}
                        alt={`${fromTokenName} coin`}
                      />
                    ) : (
                      <CoinFade width={17} address={item.tokenFrom} />
                    )}
                  </div>
                </div>
                {fromDisplayType === "fiat" && (
                  <span className="fiat-name">{fromTokenName}</span>
                )}
              </Link>
            </div>
          </div>
          <div className="feed-post__bottom">
            <div className="feed-post__bottom__icon">
              <FeedCalendar />
            </div>
            <div className="feed-post__bottom__section">
              <span>{dateArray[0]}</span>
            </div>
            <div className="feed-post__bottom__section feed-post__bottom__section--time">
              {dateArray[1]}
            </div>
          </div>
        </div>
        <div className="feed-post__left">
          <div className="feed-post__main">
            <div className="feed-post__section">
              <div className="feed-post__section__header">
                <span>FOR</span>
              </div>
              <Link
                target="_blank"
                href={explorerUri + "/token/" + item.tokenFrom}
                className="feed-post__section__main"
              >
                <span className="feed-post__section__main__name">
                  <span>
                    <GreenDot int={toInt} dec={toDec} />
                  </span>
                  {toTokenName}
                </span>
                <div className="token-to-buy__token__icon">
                  {chainId && <HexChain width={17} uri={getIconUri(chainId)} />}
                  <div
                    className={classNames(
                      "user-placeholder user-placeholder--md",
                      {
                        "user-placeholder--noaddress": !toTokenIcon,
                      }
                    )}
                  >
                    {toTokenIcon ? (
                      <Image
                        src={toTokenIcon}
                        width={17}
                        height={17}
                        alt={`${toTokenName} coin`}
                      />
                    ) : (
                      <CoinFade width={17} address={item.tokenTo} />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <div className="feed-post__bottom">
            <div className="feed-post__bottom__icon">
              <FeedChange />
            </div>
            <div className="feed-post__bottom__section feed-post__bottom__section--time">
              {dexName.split(" ")[0]}
            </div>
            {explorerUri && (
              <Link
                target="_blank"
                href={explorerUri + "/tx/" + item.txnHash}
                className="feed-post__bottom__section feed-post__bottom__section--btn"
              >
                {explorerName}
                <ExplorerFeed />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPost;

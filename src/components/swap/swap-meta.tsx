import React, { useEffect, useRef, useState } from "react";
import { ChevDown, SlippageGas, ModalInfo } from "../icons";
import PriceImpactInfo from "./price-impact-info";
import { Portal } from "../slippage-modal/portal";
import { Execute } from "@reservoir0x/relay-sdk";
import { useSlippage } from "@/context/SlippageContext";
import SkeletonLoaderWrapper from "../skeleton";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import { formatUnits } from "viem";
import Link from "next/link";
import ClockInfo from "../icons/ClockInfo";

const relayDocUri = "https://docs.relay.link/what-is-relay";

type Props = {
  quote: Execute | null;
  isLoading: boolean;
};

const SwapMeta = ({ quote, isLoading }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [isOpenSlippage, setIsOpenSlippage] = useState(false);

  const { isCustomSlippage, value } = useSlippage();
  const isTouchRef = useRef(false);

  const totalImpactPercent = quote?.details?.totalImpact?.percent || "0";
  const totalImpactUsd = Number(
    quote?.details?.totalImpact?.usd || "0.00"
  ).toFixed(2);

  const swapImpactUsd = Number(
    quote?.details?.swapImpact?.usd ?? "0.00"
  ).toFixed(2);

  const gasCurrencyName = quote?.fees?.gas?.currency?.name || "Unknown";
  const gasValueUsd = Number(quote?.fees?.gas?.amountUsd).toFixed(2);

  const relayFeeUsd = Number(quote?.fees?.relayer?.amountUsd).toFixed(2);

  const details = [
    { name: "Route", value: ["Relay"], key: "route" },
    {
      name: "Estimated time",
      value: [`~${quote?.details?.timeEstimate || 0}`, "s"],
      key: "estimation",
    },
    {
      name: "Network cost",
      value: [Number(quote?.fees?.gas?.amountUsd).toFixed(2) || "0.00", "$"],
      key: "cost",
    },
    {
      name: "Price Impact",
      value: [totalImpactPercent, "%"],
      key: "impact",
    },
    {
      name: "Max Slippage",
      value: [isCustomSlippage ? value : 1.99, "%"],
      key: "slippage",
    },
  ];

  const MetaHeaderItem = ({
    value,
    ticker,
  }: {
    value: string;
    ticker: string;
  }) => {
    // split on the dot
    const [intPart, fracPart] = value.split(".");

    return (
      <span className="meta-header-item">
        <span className="white">
          {intPart}
          {typeof fracPart !== "undefined" && (
            <>
              {/* paint the dot green */}
              <span style={{ color: "#AEE900" }}>.</span>
              {fracPart}
            </>
          )}
        </span>{" "}
        {ticker}
      </span>
    );
  };
  const wrapperRef = useRef<HTMLDivElement>(null);

  const inAmmount = parseFloat(
    quote?.details?.currencyIn?.amountFormatted || "0.00"
  );
  const outAmmount = parseFloat(
    quote?.details?.currencyOut?.amountFormatted || "0.00"
  );

  const [reverseInOut, setReverseInOut] = useState(false);

  const inPerOut = outAmmount !== 0 ? inAmmount / outAmmount : 0;

  const outPerIn = inAmmount !== 0 ? outAmmount / inAmmount : 0;

  const getTicker = (
    currencyOneSymbol: string | undefined,
    currencyTwoSymbol: string | undefined,
    preset: string
  ) =>
    quote
      ? reverseInOut
        ? currencyOneSymbol || "TOKEN"
        : currencyTwoSymbol || "TOKEN"
      : preset;

  const dropDownValue = quote
    ? (!reverseInOut ? inPerOut : outPerIn).toFixed(6)
    : "XX.XXXXXX";

  const minOut = Number(
    quote?.details?.currencyOut?.minimumAmount &&
      quote?.details?.currencyOut?.currency?.decimals
      ? formatUnits(
          BigInt(quote?.details?.currencyOut?.minimumAmount),
          quote?.details?.currencyOut?.currency?.decimals
        )
      : "0"
  ).toFixed(6);

  const detailsVariants = {
    open: {
      height: "auto",
      transition: { duration: 0.2, ease: "easeOut" as const, when: "beforeChildren", staggerChildren: 0.03 },
    },
    collapsed: {
      height: 0,
      transition: { duration: 0.2, ease: "easeOut" as const, when: "afterChildren" },
    },
  };

  // const itemVariants = {
  //   open: { opacity: 1, y: 0 },
  //   collapsed: { opacity: 0, y: -10 },
  // };

  useEffect(() => {
    if (isOpen && !quote && !isLoading) {
      setIsOpen(false);
    }
  }, [quote, isOpen, isLoading]);

  return (
    <motion.div
      variants={detailsVariants}
      id="price-impact"
      ref={wrapperRef}
      className="swap-meta__wrapper"
    >
      <div className="swap-meta__container">
        <div className="swap-meta">
          <div
            className={classNames("swap-meta__top", {
              "swap-meta__top--empty": !quote,
            })}
          >
            <SkeletonLoaderWrapper
              radius={2}
              height={22}
              width={"50%"}
              isLoading={isLoading}
              enableLayout
            >
              <button
                onClick={() => setReverseInOut(!reverseInOut)}
                className="swap-meta__top__value"
                disabled={!quote}
              >
                <MetaHeaderItem
                  value="1.00"
                  ticker={getTicker(
                    quote?.details?.currencyIn?.currency?.symbol,
                    quote?.details?.currencyOut?.currency?.symbol,

                    "SELL"
                  )}
                />
                <span> = </span>
                <MetaHeaderItem
                  value={dropDownValue}
                  //ticker="BUY"
                  ticker={getTicker(
                    quote?.details?.currencyOut?.currency?.symbol,
                    quote?.details?.currencyIn?.currency?.symbol,
                    "BUY"
                  )}
                />
              </button>
            </SkeletonLoaderWrapper>
            <button
              onClick={() => (quote ? setIsOpen(!isOpen) : undefined)}
              className={classNames("swap-meta__top__chev", {
                "swap-meta__top__chev--active": isOpen,
              })}
            >
              <ChevDown isOpen={isOpen} />
            </button>
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="swap-meta__details"
                initial="collapsed"
                animate="open"
                exit="collapsed"
                variants={detailsVariants}
                style={{ overflow: "hidden" }}
              >
                {details.map((item) => {
                  return (
                    <div className="swap-meta-item" key={item.key}>
                      <div className="swap-meta-item__name">
                        <span>{item.name}</span>
                      </div>

                      <div className="swap-meta-item__value">
                        <SkeletonLoaderWrapper
                          radius={2}
                          height={16}
                          width={"50%"}
                          isLoading={isLoading}
                          enableLayout
                        >
                          <>
                            {item.key === "estimation" && <ClockInfo />}
                            {item.key === "cost" && <SlippageGas />}
                            {item.key === "slippage" && (
                              <div
                                onTouchStart={() => { isTouchRef.current = true; }}
                                onMouseLeave={() => { if (!isTouchRef.current && isOpenSlippage) setIsOpenSlippage(false); }}
                                onMouseEnter={() => { if (!isTouchRef.current && !isOpenSlippage) setIsOpenSlippage(true); }}
                                onClick={(e) => { e.stopPropagation(); if (isTouchRef.current) setIsOpenSlippage((prev) => !prev); }}
                                className="slippage-badge swap-meta-item__value__text--modal"
                              >
                                {isCustomSlippage ? "Custom" : "Auto"}
                              </div>
                            )}
                            <Link
                              target={
                                item.key === "route" ? "_blank" : undefined
                              }
                              href={item.key === "route" ? relayDocUri : {}}
                              onMouseLeave={() => {
                                if (!isTouchRef.current && isOpenSlippage && item.key === "slippage")
                                  setIsOpenSlippage(false);
                              }}
                              onMouseEnter={() => {
                                if (!isTouchRef.current && !isOpenSlippage && item.key === "slippage")
                                  setIsOpenSlippage(true);
                              }}
                              className={classNames(
                                "swap-meta-item__value__text",
                                {
                                  "swap-meta-item__value__text--modal":
                                    item.key === "slippage" ||
                                    item.key === "route",
                                  "swap-meta-item__value__text--hover":
                                    item.key === "route",
                                }
                              )}
                            >
                              {item.value.map((v, i) => (
                                <span
                                  className={`swap-meta-item__value__text__${i}`}
                                  key={i}
                                >
                                  {v}
                                </span>
                              ))}
                              {item.key === "slippage" &&
                                wrapperRef.current && (
                                  <Portal hostId="price-impact">
                                    <AnimatePresence>
                                      {isOpenSlippage && (
                                        <PriceImpactInfo
                                          totalImpactUsd={minOut}
                                          minModal
                                          index={1}
                                        />
                                      )}
                                    </AnimatePresence>
                                  </Portal>
                                )}
                            </Link>
                            {item.key === "impact" && (
                              <div
                                onTouchStart={() => { isTouchRef.current = true; }}
                                onMouseLeave={() => { if (!isTouchRef.current && isOpenInfo) setIsOpenInfo(false); }}
                                onMouseEnter={() => { if (!isTouchRef.current && !isOpenInfo) setIsOpenInfo(true); }}
                                onClick={(e) => { e.stopPropagation(); if (isTouchRef.current) setIsOpenInfo((prev) => !prev); }}
                                className="swap-meta-item__impact"
                              >
                                <div
                                  className={classNames("modal-info-icon", {
                                    "modal-info-icon--active": isOpenInfo,
                                  })}
                                >
                                  <ModalInfo />
                                </div>
                                {wrapperRef.current && (
                                  <Portal hostId="price-impact">
                                    <AnimatePresence>
                                      {isOpenInfo && (
                                        <PriceImpactInfo
                                          type={gasCurrencyName}
                                          totalImpactUsd={totalImpactUsd}
                                          totalImpactPercent={
                                            totalImpactPercent
                                          }
                                          swapImpactUsd={swapImpactUsd}
                                          gasValueUsd={gasValueUsd}
                                          relayFeeUsd={relayFeeUsd}
                                        />
                                      )}
                                    </AnimatePresence>
                                  </Portal>
                                )}
                              </div>
                            )}
                          </>
                        </SkeletonLoaderWrapper>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default SwapMeta;

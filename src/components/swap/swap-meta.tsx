import React, { useRef, useState } from "react";
import { ChevDown, SlippageGas, ModalInfo } from "../icons";
import PriceImpactInfo from "./price-impact-info";
import { Portal } from "../slippage-modal/portal";
import { Execute } from "@reservoir0x/relay-sdk";

type Props = {
  quote: Execute | null;
};

const SwapMeta = ({ quote }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const totalImpactPercent = quote?.details?.totalImpact?.percent || "0";
  const totalImpactUsd = Number(
    quote?.details?.totalImpact?.usd || "0.00"
  ).toFixed(2);

  const swapImpactUsd =
    Number(quote?.details?.swapImpact?.usd).toFixed(2) || "0.00";

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
      value: [
        quote?.details?.slippageTolerance?.destination?.percent || "1.99",
        "%",
      ],
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

  //   return (
  //     <div  className="slippage-modal__wrapper" id="modal-root">
  //       {wrapperRef.current && (
  //         <Portal>
  //           {isOpenInfo && (
  //             <ModalInfo
  //               paragraph="We'll set the slippage automatically to minimize the failure rate"
  //               closeModal={() => setIsOpenInfo(false)}
  //             />
  //           )}
  //         </Portal>
  //       )}

  const inAmmount = parseFloat(
    quote?.details?.currencyIn?.amountFormatted || "0.00"
  );
  const outAmmount = parseFloat(
    quote?.details?.currencyOut?.amountFormatted || "0.00"
  );

  const [reverseInOut, setReverseInOut] = useState(false);

  const inPerOut = inAmmount / outAmmount;

  const outPerIn = outAmmount / inAmmount;

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

  console.log({ inAmmount, outAmmount, inPerOut, outPerIn });
  return (
    <div id="price-impact" ref={wrapperRef} className="swap-meta__wrapper">
      <div className="swap-meta__container">
        <div className="swap-meta">
          <div className="swap-meta__top">
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
            <button
              onClick={() => (quote ? setIsOpen(!isOpen) : undefined)}
              className="swap-meta__top__chev"
            >
              <ChevDown />
            </button>
          </div>
          {isOpen && (
            <div className="swap-meta__details">
              {details.map((item) => {
                return (
                  <div className="swap-meta-item" key={item.key}>
                    <div className="swap-meta-item__name">
                      <span>{item.name}</span>
                    </div>
                    <div className="swap-meta-item__value">
                      {item.key === "cost" && <SlippageGas />}
                      {item.key === "slippage" && (
                        <div className="slippage-badge">Auto</div>
                      )}
                      <span className="swap-meta-item__value__text">
                        {item.value.map((v, i) => (
                          <span
                            className={`swap-meta-item__value__text__${i}`}
                            key={i}
                          >
                            {v}
                          </span>
                        ))}
                      </span>
                      {item.key === "impact" && (
                        <div
                          onMouseLeave={() => {
                            if (isOpenInfo) setIsOpenInfo(false);
                          }}
                          onMouseEnter={() => {
                            if (!isOpenInfo) setIsOpenInfo(true);
                          }}
                          className="swap-meta-item__impact"
                        >
                          <ModalInfo />
                          {wrapperRef.current && (
                            <Portal hostId="price-impact">
                              {isOpenInfo && (
                                <PriceImpactInfo
                                  type={gasCurrencyName}
                                  totalImpactUsd={totalImpactUsd}
                                  totalImpactPercent={totalImpactPercent}
                                  swapImpactUsd={swapImpactUsd}
                                  gasValueUsd={gasValueUsd}
                                  relayFeeUsd={relayFeeUsd}
                                />
                              )}
                            </Portal>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapMeta;

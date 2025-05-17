import React, { useRef, useState } from "react";
import { ChevDown, SlippageGas, ModalInfo } from "../icons";
import PriceImpactInfo from "./price-impact-info";
import { Portal } from "../slippage-modal/portal";

type Props = {};

const SwapMeta = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const details = [
    { name: "Route", value: ["Relay"], key: "route" },
    { name: "Estimated time", value: ["~6", "s"], key: "estimation" },
    { name: "Network cost", value: ["<0,01", "$"], key: "cost" },
    { name: "Price Impact", value: ["0,07", "%"], key: "impact" },
    { name: "Max Slippage", value: ["2,00", "%"], key: "slippage" },
  ];

  const MetaHeaderItem = ({
    value,
    ticker,
  }: {
    value: string;
    ticker: string;
  }) => {
    return (
      <span className="meta-header-item">
        <span className="white">{value}</span> {ticker}
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
  return (
    <div id="price-impact" ref={wrapperRef} className="swap-meta__wrapper">
      <div className="swap-meta__container">
        <div className="swap-meta">
          <button onClick={() => setIsOpen(!isOpen)} className="swap-meta__top">
            <div className="swap-meta__top__value">
              <MetaHeaderItem value="1" ticker="ETH" />
              <span> = </span>
              <MetaHeaderItem value="2321,2" ticker="USDC" />
            </div>
            <div className="swap-meta__top__chev">
              <ChevDown />
            </div>
          </button>
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
                              {isOpenInfo && <PriceImpactInfo type="solana" />}
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

import React from "react";
import { ModalInfo } from "../icons";
import { motion } from "motion/react";
import classNames from "classnames";
type Props = {
  type?: string;
  totalImpactUsd: string;
  totalImpactPercent?: string;
  swapImpactUsd?: string;
  gasValueUsd?: string;
  relayFeeUsd?: string;
  minModal?: boolean;
  index?: number;
};

const PriceImpactInfo = ({
  type = "solana",
  totalImpactUsd,
  totalImpactPercent,
  swapImpactUsd,
  gasValueUsd,
  relayFeeUsd,
  minModal,
  index,
}: Props) => {
  const PriceUsd = ({ value, eth }: { eth?: boolean; value: string }) => {
    return (
      <span className="price-usd">
        {!eth && <span className="price-usd__dollar">$</span>}
        <span>{value}</span>
        {eth && <span className="price-usd__dollar">ETH</span>}
      </span>
    );
  };

  const impactProps = [
    {
      key: "swap",
      header: "Swap Impact",
      value: swapImpactUsd?.startsWith("-")
        ? swapImpactUsd.slice(1)
        : swapImpactUsd,
    },
    { key: "gas", header: "Gas", value: gasValueUsd },
    { key: "fee", header: "Relay Fee", value: relayFeeUsd },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={classNames("price-impact-info", {
        "price-impact-info--1": index,
      })}
    >
      <div className="price-impact-info__header">
        <ModalInfo />
        <span className="price-impact-info__header__h1">
          {minModal ? "Min. received" : "Price Impact"}
        </span>

        <div className="price-impact-info__header__impact">
          <PriceUsd
            eth={minModal}
            value={
              totalImpactUsd.startsWith("-")
                ? totalImpactUsd.slice(1)
                : totalImpactUsd
            }
          />
          {!minModal && (
            <span
              style={{
                color: totalImpactPercent?.startsWith("-")
                  ? "#F13D20"
                  : "#AEE900",
              }}
              className="price-impact-info__header__impact__change"
            >
              {"("}
              {totalImpactPercent}
              {"%)"}
            </span>
          )}
        </div>
      </div>

      {!minModal &&
        impactProps.map((item, i) => {
          return (
            <div key={i} className="impact-props">
              <div className="impact-props__header">
                <span>{item.header}</span>
                {item.key === "gas" && (
                  <div className="impact-props__header__type">{type}</div>
                )}
              </div>
              <div className="impact-props__value">
                <PriceUsd value={item.value as string} />
              </div>
            </div>
          );
        })}
    </motion.div>
  );
};

export default PriceImpactInfo;

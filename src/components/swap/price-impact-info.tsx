import React from "react";
import { ModalInfo } from "../icons";

type Props = {
  type: string;
  totalImpactUsd: string;
  totalImpactPercent: string;
  swapImpactUsd: string;
  gasValueUsd: string;
  relayFeeUsd: string;
};

const PriceImpactInfo = ({
  type = "solana",
  totalImpactUsd,
  totalImpactPercent,
  swapImpactUsd,
  gasValueUsd,
  relayFeeUsd,
}: Props) => {
  const PriceUsd = ({ value }: { value: string }) => {
    return (
      <span className="price-usd">
        <span className="price-usd__dollar">$</span>
        <span>{value}</span>
      </span>
    );
  };

  const impactProps = [
    {
      key: "swap",
      header: "Swap Impact",
      value: swapImpactUsd.startsWith("-")
        ? swapImpactUsd.slice(1)
        : swapImpactUsd,
    },
    { key: "gas", header: "Gas", value: gasValueUsd },
    { key: "fee", header: "Relay Fee", value: relayFeeUsd },
  ];

  return (
    <div className="price-impact-info">
      <div className="price-impact-info__header">
        <ModalInfo />
        <span className="price-impact-info__header__h1">Price Impact</span>

        <div className="price-impact-info__header__impact">
          <PriceUsd
            value={
              totalImpactUsd.startsWith("-")
                ? totalImpactUsd.slice(1)
                : totalImpactUsd
            }
          />
          <span
            style={{
              color: totalImpactPercent.startsWith("-") ? "#F13D20" : "#AEE900",
            }}
            className="price-impact-info__header__impact__change"
          >
            {"("}
            {totalImpactPercent}
            {"%)"}
          </span>
        </div>
      </div>

      {impactProps.map((item, i) => {
        return (
          <div key={i} className="impact-props">
            <div className="impact-props__header">
              <span>{item.header}</span>
              {item.key === "gas" && (
                <div className="impact-props__header__type">{type}</div>
              )}
            </div>
            <div className="impact-props__value">
              <PriceUsd value={item.value} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PriceImpactInfo;

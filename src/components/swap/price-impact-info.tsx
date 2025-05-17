import React from "react";
import { ModalInfo } from "../icons";

type Props = {
  type: "solana" | "ethereum";
};

const PriceImpactInfo = ({ type = "solana" }: Props) => {
  const PriceUsd = ({ value }: { value: string }) => {
    return (
      <span className="price-usd">
        <span className="price-usd__dollar">$</span>
        <span>{value}</span>
      </span>
    );
  };

  const impactProps = [
    { key: "swap", header: "Swap Impact", value: "0,05" },
    { key: "gas", header: "Gas", value: "0,05" },
    { key: "fee", header: "Relay Fee", value: "0,05" },
  ];

  return (
    <div className="price-impact-info">
      <div className="price-impact-info__header">
        <ModalInfo />
        <span className="price-impact-info__header__h1">Price Impact</span>

        <div className="price-impact-info__header__impact">
          <PriceUsd value="0,05" />
          <span className="price-impact-info__header__impact__change">
            {"("}
            {"0,05"}
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
                <div className="impact-props__header__type">
                  {type === "solana" ? "Solana" : "Ethereum"}
                </div>
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

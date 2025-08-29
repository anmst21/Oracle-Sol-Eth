import classNames from "classnames";
import React from "react";

type Props = {
  isError: boolean;
};

const BuyWindowCta = ({ isError }: Props) => {
  return (
    <div
      className={classNames("buy-window-cta", {
        "buy-window-cta--error": isError,
      })}
    >
      Buy
    </div>
  );
};

export default BuyWindowCta;

import React from "react";

type Props = {
  btnLeftHeader: string;
  btnLeftCallback: () => void;
  btnRightHeader: string;
  btnRightCallback: () => void;
  mainHeader: string;
  paragraph: string;
};

const ChartError = ({
  btnLeftCallback,
  btnLeftHeader,
  btnRightCallback,
  btnRightHeader,
  mainHeader,
  paragraph,
}: Props) => {
  return (
    <div className="chart-error">
      <h3>{mainHeader}</h3>
      <p>{paragraph}</p>
      <div className="chart-error__buttons">
        <button
          className="chart-error__buttons__left"
          onClick={btnLeftCallback}
        >
          {btnLeftHeader}
        </button>
        <button
          className="chart-error__buttons__right"
          onClick={btnRightCallback}
        >
          {btnRightHeader}
        </button>
      </div>
    </div>
  );
};

export default ChartError;

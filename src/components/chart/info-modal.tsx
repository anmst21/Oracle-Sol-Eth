import { AnimatePresence, motion } from "motion/react";
import React from "react";

type Props = {
  type: string;
  values: {
    top: number | null;
    bot: number | null;
  };
  closeModal: () => void;
};

const InfoModal = ({ values, type, closeModal }: Props) => {
  const { top, bot } = values;

  const topValue = top || 0;
  const botValue = bot || 0;
  const totalTx = topValue + botValue;

  const buyPercent = totalTx > 0 ? (topValue / totalTx) * 100 : 0;
  const sellPercent = totalTx > 0 ? (botValue / totalTx) * 100 : 0;

  const topHeader = type === "buys" ? "Buys" : "Buyers";
  const botHeader = type === "buyers" ? "Sellers" : "Sells";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={() => closeModal()}
        className="chart-info-modal"
      >
        <div className="chart-info-modal__top">
          <span className="chart-info-modal__header">{topHeader}</span>
          <div className="chart-info-modal__right">
            <div className="chart-info-modal__value">{topValue}</div>
            <div className="chart-info-modal__percent">
              {"("}
              <span>{buyPercent.toFixed(2)}%</span>
              {")"}
            </div>
          </div>
        </div>
        <div className="chart-info-modal__bot">
          <span className="chart-info-modal__header">{botHeader}</span>
          <div className="chart-info-modal__right">
            <div className="chart-info-modal__value">{botValue}</div>
            <div className="chart-info-modal__percent">
              {"("}
              <span>{sellPercent.toFixed(2)}%</span>
              {")"}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoModal;

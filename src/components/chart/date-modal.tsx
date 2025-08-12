import { AnimatePresence, motion } from "motion/react";

type Props = {
  arrayTimestamp: string[];
  closeModal: () => void;
};

function DateModal({ arrayTimestamp, closeModal }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        onClick={() => closeModal()}
        className="chart-info-modal chart-info-modal--date"
      >
        <div className="chart-info-modal__date">
          <div className="chart-info-modal__header">Date</div>
          <div className="chart-info-modal__right">
            <div className="chart-info-modal__percent">
              <span>{arrayTimestamp[2]}</span>
              {arrayTimestamp[3]}
            </div>
          </div>
        </div>
        <div className="chart-info-modal__time">
          <div className="chart-info-modal__header">Time</div>
          <div className="chart-info-modal__right">
            <div className="chart-info-modal__percent">
              <span>{arrayTimestamp[0]}</span>
              {arrayTimestamp[1]}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DateModal;

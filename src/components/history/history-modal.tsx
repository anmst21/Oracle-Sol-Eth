import { motion } from "motion/react";
import React from "react";

type Props = {
  closeModal: () => void;
};

const HistoryModal = ({ closeModal }: Props) => {
  return (
    <div onClick={closeModal} className="history-modal__wrapper">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="history-modal"
      ></motion.div>
    </div>
  );
};

export default HistoryModal;

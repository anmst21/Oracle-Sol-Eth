import React from "react";
import { ModalInfo as Info } from "../icons";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  closeModal: () => void;
  header?: string;
  paragraph: string;
};

const ModalInfo = ({ header, closeModal, paragraph }: Props) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => { e.stopPropagation(); closeModal(); }}
        className="modal-info"
      >
        <div className="modal-info__header">
          <Info />
          <span className="modal-info__header__h1">
            {header ? header : "Info"}
          </span>
        </div>
        <div className="modal-info__paragraph">
          <span>{paragraph}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ModalInfo;

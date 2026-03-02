import React from "react";
import { ModalInfo as Info } from "../icons";
import { motion } from "motion/react";

type Props = {
  closeModal: () => void;
  header?: string;
  paragraph: string;
};

// AnimatePresence must wrap the *conditional* that renders this component in
// the parent, not live inside here. That way the exit animation plays before
// the component is removed from the DOM.
const ModalInfo = ({ header, closeModal, paragraph }: Props) => {
  return (
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
  );
};

export default ModalInfo;

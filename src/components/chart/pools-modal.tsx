import { motion } from "motion/react";
import React from "react";
import { InputCross } from "../icons";

type Props = {
  closeModal: () => void;
};

const PoolsModal = ({ closeModal }: Props) => {
  return (
    <div onClick={closeModal} className="pools-modal__wrapper">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="pools-modal"
      >
        <div className="modal__header">
          <div className="modal__header__inner">
            <span>Select Token</span>
            <button
              onClick={() => closeModal()}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PoolsModal;

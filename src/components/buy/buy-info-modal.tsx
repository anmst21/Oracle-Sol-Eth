import { AnimatePresence, motion } from "motion/react";
import React from "react";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  modalItems: {
    name: string;
    icon: React.ReactNode;
    description: string;
  }[];
};

const BuyInfoModal = ({ isOpen, closeModal, modalItems }: Props) => {
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="document-item-modal__wrapper"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={closeModal}
        >
          {modalItems.map((item, i) => {
            return (
              <div key={i} className="document-item-modal">
                <div className="document-item-modal__header">
                  <span>{item.name}</span> {item.icon}
                </div>
                <div className="document-item-modal__main">
                  <span>{item.description}</span>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyInfoModal;

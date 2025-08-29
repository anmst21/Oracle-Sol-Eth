import classNames from "classnames";
import { motion } from "motion/react";
import React, { useState } from "react";
import { InputCross, ModalInfo as Info } from "../icons";
import ModalInfo from "../slippage-modal/modal-info";

type Props = {
  closeModal: () => void;
  children: React.ReactNode;
  header: string;
  modalCenter?: boolean;
  info: string;
};

const HistoryModalWrapper = ({
  closeModal,
  children,
  header,
  info,
  modalCenter,
}: Props) => {
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  return (
    <div
      onClick={closeModal}
      className={classNames("history-modal__wrapper", {
        "history-modal__wrapper--center": modalCenter,
      })}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="history-modal"
      >
        <div className="history-modal__inner">
          <div className="modal__header__inner">
            <span>{header}</span>

            <div
              className={classNames("slippage-modal__header__item info-hover", {
                "info-active": isOpenInfo,
              })}
              onMouseLeave={() => {
                if (isOpenInfo) setIsOpenInfo(false);
              }}
              onMouseEnter={() => {
                if (!isOpenInfo) setIsOpenInfo(true);
              }}
            >
              <Info />

              {isOpenInfo && (
                <ModalInfo
                  paragraph={info}
                  closeModal={() => setIsOpenInfo(false)}
                />
              )}
            </div>
            <button
              onClick={() => closeModal()}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          </div>
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default HistoryModalWrapper;

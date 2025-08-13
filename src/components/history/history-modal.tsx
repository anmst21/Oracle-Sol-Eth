import { motion } from "motion/react";
import React, { useState } from "react";
import { HistorySortType } from "./types";
import classNames from "classnames";
import ModalInfo from "../slippage-modal/modal-info";
import { InputCross, ModalInfo as Info } from "../icons";

type Props = {
  closeModal: () => void;
  type: HistorySortType;
  setType: React.Dispatch<React.SetStateAction<HistorySortType>>;
};

const HistoryModal = ({ closeModal, type, setType }: Props) => {
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  return (
    <div onClick={closeModal} className="history-modal__wrapper">
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
            <span>Sort By</span>

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
                  paragraph="If the price exceeds the maximum slippage percentage, the transaction will revert."
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

          <motion.div className="slippage-modal__button">
            <button
              className={classNames({
                "slippage-modal__button--active": type === "network",
              })}
              onClick={() => setType("network")}
              key={"network-sort"}
            >
              Network
              {type === "network" ? (
                <motion.div layoutId="underline" className="underline" />
              ) : null}
            </button>
            <button
              key={"wallet-sort"}
              className={classNames({
                "slippage-modal__button--active": type === "wallet",
              })}
              onClick={() => setType("wallet")}
            >
              Wallet
              {type === "wallet" ? (
                <motion.div layoutId="underline" className="underline" />
              ) : null}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default HistoryModal;

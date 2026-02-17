import classNames from "classnames";
import { motion } from "motion/react";
import React from "react";
import { InputCross, ModalInfo as Info } from "../icons";
import ModalInfo from "../slippage-modal/modal-info";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useInfoToggle } from "@/hooks/useInfoToggle";

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
  useBodyScrollLock();
  const [isOpenInfo, setIsOpenInfo, infoBind] = useInfoToggle();
  return (
    <div
      onClick={closeModal}
      className={classNames("history-modal__wrapper", {
        "history-modal__wrapper--center": modalCenter,
      })}
    >
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => {
          e.stopPropagation();
          if (isOpenInfo) setIsOpenInfo(false);
        }}
        className="history-modal"
      >
        <div className="history-modal__inner">
          <div className="modal__header__inner">
            <span>{header}</span>

            <div
              className={classNames("slippage-modal__header__item info-hover", {
                "info-active": isOpenInfo,
              })}
              {...infoBind}
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

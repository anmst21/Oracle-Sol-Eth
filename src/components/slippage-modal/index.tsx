import React, { useRef, useState } from "react";
import { InputCross, ModalInfo as Info } from "../icons";
import classNames from "classnames";
import ModalInfo from "./modal-info";
import { Portal } from "./portal";
import ModalInput from "./modal-input";
import { useSlippage } from "@/context/SlippageContext";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  closeModal: () => void;
};

const SlippageModal = ({ closeModal }: Props) => {
  const { isCustomSlippage, setIsCustomSlippage } = useSlippage();
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        ref={wrapperRef}
        className="slippage-modal__wrapper"
        id="modal-root"
      >
        <div className="slippage-modal__container">
          <div className="slippage-modal">
            <div className="slippage-modal__header">
              <span className="slippage-modal__header__h1">Max Slippage</span>
              <div
                className={classNames(
                  "slippage-modal__header__item info-hover",
                  {
                    "info-active": isOpenInfo,
                  }
                )}
                onMouseLeave={() => {
                  if (isOpenInfo) setIsOpenInfo(false);
                }}
                onMouseEnter={() => {
                  if (!isOpenInfo) setIsOpenInfo(true);
                }}
              >
                <Info />
                {wrapperRef.current && (
                  <Portal>
                    {isOpenInfo && (
                      <ModalInfo
                        paragraph="If the price exceeds the maximum slippage percentage, the transaction will revert."
                        closeModal={() => setIsOpenInfo(false)}
                      />
                    )}
                  </Portal>
                )}
              </div>
              <button
                className="slippage-modal__header__item cross"
                onClick={() => closeModal()}
              >
                <InputCross />
              </button>
            </div>
            <motion.div className="slippage-modal__button">
              <button
                className={classNames({
                  // "slippage-modal__button--active": !isCustomSlippage,
                })}
                onClick={() => setIsCustomSlippage(false)}
                key={"auto-slippage"}
              >
                Auto
                {!isCustomSlippage ? (
                  <motion.div layoutId="underline" className="underline" />
                ) : null}
              </button>
              <button
                key={"manual-slippage"}
                className={classNames({
                  //   "slippage-modal__button--active": isCustomSlippage,
                })}
                onClick={() => setIsCustomSlippage(true)}
              >
                Custom
                {isCustomSlippage ? (
                  <motion.div layoutId="underline" className="underline" />
                ) : null}
              </button>
            </motion.div>

            <motion.div
              layout // <-- this tells Framer Motion to animate height
              style={{ display: "flex", overflow: "hidden", width: "100%" }} // <-- hide overflow while animating
              className="slippage-modal__body"
            >
              <AnimatePresence initial={false} mode="wait">
                {isCustomSlippage ? (
                  <motion.div
                    key="custom"
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: "flex", flex: 1 }}
                  >
                    <ModalInput />
                  </motion.div>
                ) : (
                  <motion.div
                    key="auto"
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="slippage-modal__warning">
                      <span>
                        We&apos;ll set the slippage automatically to minimize
                        the failure rate
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SlippageModal;

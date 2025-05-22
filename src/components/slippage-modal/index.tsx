import React, { useRef, useState } from "react";
import { InputCross, ModalInfo as Info } from "../icons";
import classNames from "classnames";
import ModalInfo from "./modal-info";
import { Portal } from "./portal";
import ModalInput from "./modal-input";
import { useSlippage } from "@/context/SlippageContext";

type Props = {
  closeModal: () => void;
};

const SlippageModal = ({ closeModal }: Props) => {
  const { isCustomSlippage, setIsCustomSlippage } = useSlippage();
  const [isOpenInfo, setIsOpenInfo] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={wrapperRef} className="slippage-modal__wrapper" id="modal-root">
      {wrapperRef.current && (
        <Portal>
          {isOpenInfo && (
            <ModalInfo
              paragraph="We'll set the slippage automatically to minimize the failure rate"
              closeModal={() => setIsOpenInfo(false)}
            />
          )}
        </Portal>
      )}
      <div className="slippage-modal__container">
        <div className="slippage-modal">
          <div className="slippage-modal__header">
            <span className="slippage-modal__header__h1">Max Slippage</span>
            <div
              className="slippage-modal__header__item"
              onMouseLeave={() => {
                if (isOpenInfo) setIsOpenInfo(false);
              }}
              onMouseEnter={() => {
                if (!isOpenInfo) setIsOpenInfo(true);
              }}
            >
              <Info />
            </div>
            <button
              className="slippage-modal__header__item cross"
              onClick={() => closeModal()}
            >
              <InputCross />
            </button>
          </div>
          <div className="slippage-modal__button">
            <button
              className={classNames({
                "slippage-modal__button--active": !isCustomSlippage,
              })}
              onClick={() => setIsCustomSlippage(false)}
            >
              Auto
            </button>
            <button
              className={classNames({
                "slippage-modal__button--active": isCustomSlippage,
              })}
              onClick={() => setIsCustomSlippage(true)}
            >
              Custom
            </button>
          </div>

          {isCustomSlippage ? (
            <ModalInput />
          ) : (
            <div className="slippage-modal__warning">
              <span>
                We&apos;ll set the slippage automatically to minimize the
                failure rate
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlippageModal;

import React from "react";
import { ModalInfo as Info } from "../icons";

type Props = {
  closeModal: () => void;
  header?: string;
  paragraph: string;
};

const ModalInfo = ({ header, closeModal, paragraph }: Props) => {
  return (
    <div onClick={() => closeModal()} className="modal-info">
      <div className="modal-info__header">
        <Info />
        <span className="modal-info__header__h1">
          {header ? header : "Info"}
        </span>
      </div>
      <div className="modal-info__paragraph">
        <span>{paragraph}</span>
      </div>
    </div>
  );
};

export default ModalInfo;

import React, { useState } from "react";
import { DocSpec } from "./types";
import classNames from "classnames";
import BuyInfoModal from "./buy-info-modal";

const DocumentItem = ({ docSpec }: { docSpec: DocSpec }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <span
      onMouseEnter={() => setIsModalOpen(true)}
      onMouseLeave={() => setIsModalOpen(false)}
      className={classNames("document-item", {
        "document-item--active": isModalOpen,
      })}
    >
      {docSpec.icon}

      <BuyInfoModal
        modalItems={[docSpec]}
        isOpen={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
      />
    </span>
  );
};

export default DocumentItem;

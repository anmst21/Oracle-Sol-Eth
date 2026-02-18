import React, { useCallback, useEffect, useRef, useState } from "react";
import { DocSpec } from "./types";
import classNames from "classnames";
import BuyInfoModal from "./buy-info-modal";

const DocumentItem = ({ docSpec }: { docSpec: DocSpec }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Only toggle on touch — mouse uses hover
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      setIsModalOpen((prev) => !prev);
    }
  }, []);

  // Close when tapping outside on mobile
  useEffect(() => {
    if (!isModalOpen) return;
    const handleOutside = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    return () => document.removeEventListener("pointerdown", handleOutside);
  }, [isModalOpen]);

  return (
    <span
      ref={ref}
      onMouseEnter={() => setIsModalOpen(true)}
      onMouseLeave={() => setIsModalOpen(false)}
      onPointerDown={handlePointerDown}
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

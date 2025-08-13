import React, { ChangeEvent, useCallback } from "react";
import PaginationSwitch from "./pagination-switch";
import PaginationCurrent from "./pagination-current";
import { motion } from "motion/react";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage?: number;
  setItemsPerPage?: React.Dispatch<React.SetStateAction<number>>;
  disabled: boolean;
  disableItemsPerPage?: boolean;
  disableRight?: boolean;
};

const ModalPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  disabled,
  setItemsPerPage,
  disableItemsPerPage,
  disableRight,
}: Props) => {
  const setPage = useCallback(
    (value: number) => {
      console.log("set value", value);
      setCurrentPage(value);
    },
    [setCurrentPage]
  );

  const onSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      setCurrentPage(1);
      if (setItemsPerPage) setItemsPerPage(Number(value));
    },
    [setItemsPerPage, setCurrentPage]
  );

  return (
    <motion.div
      initial={disabled ? { y: "100%", opacity: 0 } : { y: "0%", opacity: 1 }}
      animate={
        disabled
          ? { y: "100%", opacity: 0, pointerEvents: "none" }
          : { y: "0%", opacity: 1, pointerEvents: "auto" }
      }
      transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.6 }}
      className="modal-pagination"
    >
      <div className="modal-pagination__header">Page:</div>

      <PaginationCurrent
        disabled={disabled}
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setPage}
        disableRight={disableRight}
      />
      {!disableItemsPerPage && (
        <PaginationSwitch disabled={disabled} onSelectChange={onSelectChange} />
      )}
    </motion.div>
  );
};

export default ModalPagination;

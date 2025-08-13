import React, { useRef, useEffect } from "react";
import { PaginationProps } from "./types";
import { PaginationArrow } from "../icons";
import { AnimatePresence, motion } from "motion/react";

const PaginationCurrent = ({
  disabled,
  currentPage,
  setPage,
  totalPages,
  disableRight,
}: PaginationProps) => {
  // keep the last rendered page in a ref (no state => no race)
  const prevRef = useRef(currentPage);
  const prevPage = prevRef.current;
  const goingForward = currentPage > prevPage; // true if incrementing

  // update after paint so this render still sees the true "prev"
  useEffect(() => {
    prevRef.current = currentPage;
  }, [currentPage]);

  return (
    <div className="pagination-current">
      <button
        disabled={disabled || currentPage <= 1}
        onClick={() => currentPage > 1 && setPage(currentPage - 1)}
        className="modal-pagination__arrow arrow-inverted"
      >
        <PaginationArrow />
      </button>
      <div className="pagination-current__container">
        <span
          className="pagination-current__container__text"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {/* clip wrapper to avoid first-frame jank */}
          <span className="inline-block h-[1em] overflow-hidden leading-none align-baseline">
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={currentPage} // key ONLY by value; let AP handle exit/enter
                initial={{ y: goingForward ? "100%" : "-100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: goingForward ? "-100%" : "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 40,
                  mass: 0.6,
                  duration: 100,
                }}
                className="block pagination-current__container__current"
              >
                {currentPage < 10 && "0"}
                {currentPage}
              </motion.span>
            </AnimatePresence>
          </span>

          <span className="pagination-current__container__total">
            /{totalPages < 10 && "0"}
            {totalPages}
          </span>
        </span>
      </div>

      <button
        disabled={disableRight || disabled || currentPage >= totalPages}
        onClick={() => currentPage < totalPages && setPage(currentPage + 1)}
        className="modal-pagination__arrow"
      >
        <PaginationArrow />
      </button>
    </div>
  );
};

export default PaginationCurrent;

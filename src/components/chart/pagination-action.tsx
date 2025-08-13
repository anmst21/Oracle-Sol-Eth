import React from "react";
import PaginationArrow from "../icons/PaginationArrow";
import { PaginationProps } from "./types";

const PaginationAction = ({
  disabled,
  currentPage,
  setPage,
  totalPages,
}: PaginationProps) => {
  return (
    <div className="modal-pagination__action">
      {currentPage > 1 && (
        <button
          disabled={disabled}
          onClick={() => setPage(currentPage - 1)}
          className="modal-pagination__arrow arrow-inverted"
        >
          <PaginationArrow />
        </button>
      )}
      {currentPage >= 4 && (
        <button
          disabled={disabled}
          onClick={() => setPage(1)}
          className="modal-pagination__number"
        >
          1
        </button>
      )}
      {currentPage >= 3 && currentPage < 5 && (
        <button
          disabled={disabled}
          onClick={() => setPage(currentPage - 2)}
          className="modal-pagination__number"
        >
          {currentPage - 2}
        </button>
      )}
      {currentPage > 4 && (
        <button disabled={disabled} className="modal-pagination__dots">
          ...
        </button>
      )}
      {currentPage === totalPages && (
        <button
          disabled={disabled}
          onClick={() => setPage(currentPage - 2)}
          className="modal-pagination__number"
        >
          {currentPage - 2}
        </button>
      )}
      {currentPage >= 2 && (
        <button
          disabled={disabled}
          onClick={() => setPage(currentPage - 1)}
          className="modal-pagination__number"
        >
          {currentPage - 1}
        </button>
      )}
      <button
        disabled={disabled}
        className="modal-pagination__number modal-pagination__current"
      >
        {currentPage}
      </button>
      {currentPage < totalPages - 1 && (
        <button
          disabled={disabled}
          onClick={() => setPage(currentPage + 1)}
          className="modal-pagination__number"
        >
          {currentPage + 1}
        </button>
      )}
      {(currentPage < 2 || currentPage >= totalPages - 3) &&
        currentPage < totalPages - 2 && (
          <button
            disabled={disabled}
            onClick={() => setPage(currentPage + 1)}
            className="modal-pagination__number"
          >
            {currentPage + 2}
          </button>
        )}
      {currentPage < totalPages - 3 && (
        <button disabled={disabled} className="modal-pagination__dots">
          ...
        </button>
      )}
      {currentPage !== totalPages && (
        <button
          disabled={disabled}
          onClick={() => setPage(totalPages)}
          className="modal-pagination__number"
        >
          {totalPages}
        </button>
      )}
      {currentPage !== totalPages && (
        <button
          disabled={disabled}
          onClick={() => setPage(currentPage + 1)}
          className="modal-pagination__arrow"
        >
          <PaginationArrow />
        </button>
      )}
    </div>
  );
};

export default PaginationAction;

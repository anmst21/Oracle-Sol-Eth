import React, { ChangeEvent, useCallback } from "react";
import { ModalChevDown, PaginationArrow } from "../icons";

type Props = {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  itemsPerPage: number;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  disabled: boolean;
};

const ModalPagination = ({
  currentPage,
  totalPages,
  setCurrentPage,
  // itemsPerPage,
  disabled,
  setItemsPerPage,
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
      setItemsPerPage(Number(value));
    },
    [setItemsPerPage, setCurrentPage]
  );

  const options = [12, 24, 36, 48, 60];

  return (
    <div className="modal-pagination">
      <div className="modal-pagination__header">Page:</div>
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

      <label htmlFor="locale" className={"modal-switch"}>
        <span>Show:</span>
        <select
          disabled={disabled}
          onChange={onSelectChange}
          //   disabled={isPending}
          defaultValue={12}
          name="locale"
          id="locale"
        >
          {options.map((value) => {
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
        <div className="lang-switch__chev">
          <ModalChevDown />
        </div>
      </label>
    </div>
  );
};

export default ModalPagination;

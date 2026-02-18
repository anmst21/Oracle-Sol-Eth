import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { InputCross } from "../icons";
import { TRANSITION } from "../shared/animation";
import ModalPagination from "../chart/modal-pagination";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { COUNTRY_LIST } from "./country-list";
import Image from "next/image";
import { flagCdnUri } from "@/types/flag-cdn-uri";
import classNames from "classnames";

type Props = {
  closeModal: () => void;
  country: string;
};

const RegionsModal = ({ closeModal, country }: Props) => {
  useBodyScrollLock();
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  console.log("RegionsModal data:", COUNTRY_LIST);

  const sortedCountries = useMemo(() => {
    const arr = [...COUNTRY_LIST];
    const idx = arr.findIndex(
      (c) => c.alpha2.toUpperCase() === country.toUpperCase()
    );
    if (idx > 0) {
      const [active] = arr.splice(idx, 1);
      arr.unshift(active);
    }
    return arr;
  }, [country]);

  const totalPages = Math.ceil(sortedCountries.length / itemsPerPage);

  const paginatedCountries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCountries.slice(start, start + itemsPerPage);
  }, [sortedCountries, currentPage, itemsPerPage]);

  return (
    <div onClick={closeModal} className="pools-modal__wrapper">
      <motion.div
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
        exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
        transition={TRANSITION}
        onClick={(e) => e.stopPropagation()}
        className="pools-modal trades-modal"
      >
        <div className="modal__header">
          <div className="modal__header__inner">
            <span>Select Region</span>
            <button
              onClick={() => closeModal()}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          </div>
        </div>

        <div className="modal-table">
          <table>
            <thead>
              <tr>
                <th className="modal-table__header__index">
                  <div>
                    <span>#</span>
                  </div>
                </th>
                <th className="modal-table__header__time">
                  <div>
                    <span>Country</span>
                  </div>
                </th>
                <th className="modal-table__header__type">
                  <div>
                    <span>Code</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedCountries.map((c, i) => {
                const isActive =
                  c.alpha2.toUpperCase() === country.toUpperCase();
                return (
                  <tr
                    key={c.alpha2}
                    className={classNames(
                      "trade-item pool-item region-item",
                      { "region-item--active": isActive }
                    )}
                  >
                    <td className="trade-item__index">
                      <div>
                        <span>
                          {(currentPage - 1) * itemsPerPage + i + 1}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="pool-item__pool">
                        <div className="pool-item__pool__image">
                          <Image
                            width={32}
                            height={32}
                            alt={`${c.name} flag`}
                            src={flagCdnUri(c.alpha2)}
                          />
                        </div>
                        <div className="pool-item__pool__name">
                          <div className="pool-item__pool__name__top">
                            <span>{c.name}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="trade-item__kind">
                      <div className="trade-item__kind__block">
                        <span>{c.alpha2}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <ModalPagination
            disabled={false}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default RegionsModal;

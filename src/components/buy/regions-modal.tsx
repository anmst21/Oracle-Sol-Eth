import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import { InputCross } from "../icons";

import { modalAnimation } from "../chart/animation";
import {
  MoonpayCountriesResponse,
  MoonpayIpResponse,
} from "@/types/moonpay-api";
import ChartError from "../chart/chart-error";
import ModalPagination from "../chart/modal-pagination";
import RegionItem from "./region-item";

type Props = {
  closeModal: () => void;
  countries: MoonpayCountriesResponse;
  moonpayIp: MoonpayIpResponse;
};

const RegionsModal = ({ closeModal, countries, moonpayIp }: Props) => {
  // console.log({ moonpayIp, countries });
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [currentPage, setCurrentPage] = useState(1);
  const sortedCountries = useMemo(() => {
    if (!Array.isArray(countries) || countries.length === 0) return [];
    const activeA3 = moonpayIp?.alpha3?.toUpperCase?.();
    const arr = countries.slice(); // copy to avoid mutation
    if (!activeA3) return arr;

    const idx = arr.findIndex((c) => c.alpha3?.toUpperCase?.() === activeA3);
    if (idx > 0) {
      const [active] = arr.splice(idx, 1);
      arr.unshift(active);
    }
    return arr;
  }, [countries, moonpayIp?.alpha3]);

  const totalPages = Math.ceil(sortedCountries.length / itemsPerPage);

  // 2) Paginate *after* sorting
  const paginatedCountries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedCountries.slice(start, start + itemsPerPage);
  }, [sortedCountries, currentPage, itemsPerPage]);

  return (
    <div onClick={closeModal} className="pools-modal__wrapper">
      <motion.div
        {...modalAnimation}
        onClick={(e) => e.stopPropagation()}
        className="pools-modal trades-modal"
      >
        <div className="modal__header">
          <div className="modal__header__inner">
            <span>Available Regions</span>
            <button
              onClick={() => closeModal()}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          </div>
        </div>

        <div className="modal-table">
          {!countries && (
            <ChartError
              btnLeftCallback={() => {}}
              btnLeftHeader={"Reload Data"}
              btnRightCallback={() => closeModal()}
              btnRightHeader={"Close Window"}
              mainHeader={"Unable to Load Trades"}
              paragraph={
                "We encountered an issue retrieving the latest trades data. This may be due to a temporary network problem or unavailable data from the source."
              }
            />
          )}
          <table>
            <thead>
              <tr>
                <th className="modal-table__header__index">
                  <div>
                    <span>№</span>
                  </div>
                </th>
                <th className="modal-table__header__time">
                  <div>
                    <span>Country</span>
                  </div>
                </th>
                <th className="modal-table__header__type">
                  <div>
                    <span>Buy</span>
                  </div>
                </th>
                <th className="modal-table__header__price">
                  <div>
                    <span>Sell</span>
                  </div>
                </th>
                <th className="pools-modal__header__txn">
                  <div>
                    <span>Supported Docs</span>
                  </div>
                </th>
                <th className="pools-modal__header__vol">
                  <div>
                    <span>Suggested Docs</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {isLoadingTrades &&
                Array.from({ length: 12 }, (_, i) => (
                  <TradeItemSkeleton index={i + 1} key={i} />
                ))} */}
              {paginatedCountries.map((country, i) => (
                <RegionItem
                  isActive={country.alpha3 === moonpayIp.alpha3}
                  key={i}
                  country={country}
                  index={i + 1}
                />
              ))}

              {/* <RegionItem key={1} country={paginatedCountries[0]} index={1} /> */}
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

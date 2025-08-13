import { motion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InputCross } from "../icons";
import { modalAnimation } from "./animation";
import {
  TradeItem as TradeItemType,
  TradesResponse,
} from "@/types/trades-response";
import { useChart } from "@/context/ChartProvider";
import { geckoTerminalBaseUri } from "@/helpers/gecko-terminal-dex-data";
import TradeItem from "./trade-item";
import ModalPagination from "./modal-pagination";
import TradeItemSkeleton from "./trade-item-skeleton";
import ChartError from "./chart-error";

type Props = {
  closeModal: () => void;
};

const PoolsModal = ({ closeModal }: Props) => {
  const [trades, setTrades] = useState<TradeItemType[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);
  const [isErrorTrades, setIsErrorTrades] = useState(false);

  const { requestChain, activePool } = useChart();
  console.log("trades", trades, isLoadingTrades, isErrorTrades);

  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(trades.length / itemsPerPage);

  const paginatedTrades = useMemo(
    () =>
      trades.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [trades, currentPage, itemsPerPage]
  );

  console.log("paginatedTrades", paginatedTrades);

  const getTrades = useCallback(async () => {
    setIsErrorTrades(false);
    setIsLoadingTrades(true);

    try {
      // build URL + query string
      const url =
        geckoTerminalBaseUri +
        `/networks/${requestChain?.name}/pools/${activePool?.attributes.address}/trades`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);

      const json = (await res.json()) as TradesResponse;
      setTrades(json.data);
    } catch (err) {
      console.error("fetch trades failed", err);
      setIsErrorTrades(true);
    } finally {
      setIsLoadingTrades(false);
    }
  }, [activePool, requestChain]);

  useEffect(() => {
    if (requestChain && activePool) {
      getTrades();
    }
  }, [activePool, requestChain, getTrades]);

  const { relayChain } = useChart();

  return (
    <div onClick={closeModal} className="pools-modal__wrapper">
      <motion.div
        {...modalAnimation}
        onClick={(e) => e.stopPropagation()}
        className="pools-modal trades-modal"
      >
        <div className="modal__header">
          <div className="modal__header__inner">
            <span>Latest Trades</span>
            <button
              onClick={() => closeModal()}
              className="chain-sidebar__input__abandon"
            >
              <InputCross />
            </button>
          </div>
        </div>
        <div className="modal-table">
          {isErrorTrades && (
            <ChartError
              btnLeftCallback={() => getTrades()}
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
                    <span>Time</span>
                  </div>
                </th>
                <th className="modal-table__header__type">
                  <div>
                    <span>Type</span>
                  </div>
                </th>
                <th className="modal-table__header__price">
                  <div>
                    <span>Price</span>
                  </div>
                </th>
                <th className="modal-table__header__amount">
                  <div>
                    <span>Amount</span>
                  </div>
                </th>
                <th className="modal-table__header__value">
                  <div>
                    <span>Value</span>
                  </div>
                </th>
                <th className="modal-table__header__from">
                  <div>
                    <span>From</span>
                  </div>
                </th>
                <th className="modal-table__header__tx">
                  <div>
                    <span>TX</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoadingTrades &&
                Array.from({ length: 12 }, (_, i) => (
                  <TradeItemSkeleton index={i + 1} key={i} />
                ))}

              {!isLoadingTrades &&
                paginatedTrades &&
                paginatedTrades.map((item, i) => (
                  <TradeItem
                    explorerUrl={relayChain?.explorerUrl}
                    key={i}
                    item={item}
                    index={i + 1}
                  />
                ))}
            </tbody>
          </table>
          <ModalPagination
            disabled={isLoadingTrades || isErrorTrades}
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

export default PoolsModal;

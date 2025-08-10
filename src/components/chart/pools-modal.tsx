import { motion } from "motion/react";
import React, { useCallback } from "react";
import { InputCross } from "../icons";
import { modalAnimation } from "./animation";
import { useChart } from "@/context/ChartProvider";
import PoolItem from "./pool-item";
import { PoolItem as PoolItemType } from "@/types/token-pools";

type Props = {
  closeModal: () => void;
};

const PoolsModal = ({ closeModal }: Props) => {
  const {
    tokenPools,
    isLoadingPools,
    isErrorPools,
    chartData,
    isLoadingChart,
    isErrorChart,
    sortType,
    setSortType,
    chartType,
    setChartType,
    isOpenPools,
    setIsOpenPools,
    requestChain,
    //tokenMeta,
    activePool,
    setActivePool,
    relayChain,
    isOpenTrades,
    setIsOpenTrades,
    activeToken,
  } = useChart();

  const activePoolCallback = useCallback(
    (item: PoolItemType) => setActivePool(item),
    [setActivePool]
  );

  return (
    <div onClick={closeModal} className="pools-modal__wrapper">
      <motion.div
        {...modalAnimation}
        onClick={(e) => e.stopPropagation()}
        className="pools-modal trades-modal"
      >
        <div className="modal__header">
          <div className="modal__header__inner">
            <span>Select Pool</span>
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
                    <span>№</span>
                  </div>
                </th>
                <th className="pools-modal__header__pool">
                  <div>
                    <span>Pool</span>
                  </div>
                </th>
                <th className="pools-modal__header__fdv">
                  <div>
                    <span>FDV</span>
                  </div>
                </th>
                <th className="pools-modal__header__age">
                  <div>
                    <span>Age</span>
                  </div>
                </th>
                <th className="pools-modal__header__5m">
                  <div>
                    <span>
                      5<span className="table-secondary-value">m</span>
                    </span>
                  </div>
                </th>
                <th className="pools-modal__header__1h">
                  <div>
                    <span>
                      1<span className="table-secondary-value">h</span>
                    </span>
                  </div>
                </th>
                <th className="pools-modal__header__6h">
                  <div>
                    <span>
                      6<span className="table-secondary-value">h</span>
                    </span>
                  </div>
                </th>
                <th className="pools-modal__header__24h">
                  <div>
                    <span>
                      24<span className="table-secondary-value">h</span>
                    </span>
                  </div>
                </th>
                <th className="pools-modal__header__liq">
                  <div>
                    <span>Liq</span>
                  </div>
                </th>
                <th className="pools-modal__header__txn">
                  <div>
                    <span>TXN</span>
                  </div>
                </th>
                <th className="pools-modal__header__vol">
                  <div>
                    <span>Vol</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="pools-modal__main">
              {tokenPools?.map((item, i) => {
                return (
                  <PoolItem
                    callback={() => {
                      activePoolCallback(item);
                      closeModal();
                    }}
                    chainName={requestChain?.name}
                    index={i + 1}
                    item={item}
                    activeToken={activeToken}
                    key={i}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default PoolsModal;

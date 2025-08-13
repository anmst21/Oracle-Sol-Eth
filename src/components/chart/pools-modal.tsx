import { motion } from "motion/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InputCross } from "../icons";
import { modalAnimation } from "./animation";
import { useChart } from "@/context/ChartProvider";
import PoolItem from "./pool-item";
import { PoolItem as PoolItemType } from "@/types/token-pools";
import ModalPagination from "./modal-pagination";
import PoolItemSkeleton from "./pool-item-skeleton";
import ChartError from "./chart-error";

type Props = {
  closeModal: () => void;
};

function chunkArray<T>(array: T[] | null, size: number): T[][] {
  if (array === null) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const PoolsModal = ({ closeModal }: Props) => {
  // const totalPages = 10;
  const [totalPages, setTotalPages] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const {
    tokenPools,
    isLoadingPools,
    isErrorPools,

    requestChain,
    activePool,
    setActivePool,
    activeToken,
    isLoadingMorePools,
    isErrorMorePools,
    isNoMorePools,
    fetchMorePoolsForToken,
    setIsErrorMorePools,
    setIsNoMorePools,
  } = useChart();

  useEffect(() => {
    setTotalPages(10);
  }, [activeToken]);

  const tokenPools2D = useMemo(() => chunkArray(tokenPools, 20), [tokenPools]);

  const activePoolCallback = useCallback(
    (item: PoolItemType) => setActivePool(item),
    [setActivePool]
  );

  useEffect(() => {
    const chunk = tokenPools2D[currentPage - 1];

    if (!chunk && !isLoadingMorePools && !isNoMorePools) {
      fetchMorePoolsForToken(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (isNoMorePools && tokenPools && tokenPools?.length > 0) {
      const pageCount = Math.max(1, Math.ceil((tokenPools?.length ?? 0) / 20));

      setTotalPages(pageCount);
    }
  }, [isNoMorePools, tokenPools]);

  const goBack = useCallback(() => {
    setIsErrorMorePools(false);
    setIsNoMorePools(true);
    setCurrentPage(currentPage - 1);
  }, [setCurrentPage, setIsNoMorePools, setIsErrorMorePools, currentPage]);

  const closeError = useCallback(() => {
    setIsErrorMorePools(false);
    setIsNoMorePools(true);
    closeModal();
  }, [setIsNoMorePools, setIsErrorMorePools, closeModal]);

  return (
    <div onClick={closeModal} className="pools-modal__wrapper">
      <motion.div
        {...modalAnimation}
        onClick={(e) => e.stopPropagation()}
        className="trades-modal pools-modal pools-modal-cursor"
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
          {isErrorMorePools && (
            <ChartError
              btnLeftCallback={goBack}
              btnLeftHeader={"Go Back"}
              btnRightCallback={closeError}
              btnRightHeader={"Close Window"}
              mainHeader={"Unable to Load Pools"}
              paragraph={
                "We encountered an issue retrieving the latest pools data. This may be due to a temporary network problem or unavailable data from the source."
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
              {isLoadingMorePools &&
                Array.from({ length: 20 }, (_, i) => (
                  <PoolItemSkeleton index={i + 1} key={i} />
                ))}
              {!isLoadingMorePools &&
                tokenPools2D[currentPage - 1]?.map((item, i) => {
                  return (
                    <PoolItem
                      isActive={
                        item.attributes.address ===
                        activePool?.attributes.address
                      }
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
          <ModalPagination
            disabled={isLoadingPools || isErrorPools}
            totalPages={totalPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            disableItemsPerPage={true}
            disableRight={
              (currentPage === tokenPools2D.length &&
                (isNoMorePools || isErrorMorePools)) ||
              isLoadingMorePools
            }
          />
        </div>
      </motion.div>
    </div>
  );
};

export default PoolsModal;

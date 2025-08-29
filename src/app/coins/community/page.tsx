import ChartError from "@/components/chart/chart-error";
import ModalPagination from "@/components/chart/modal-pagination";

export default function Page() {
  return (
    <div className="community-coins">
      <div className="modal-table">
        {/* {isErrorMorePools && (
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
        )} */}
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
            {/* {isLoadingMorePools &&
              Array.from({ length: 20 }, (_, i) => (
                <PoolItemSkeleton index={i + 1} key={i} />
              ))} */}
            {/* {!isLoadingMorePools &&
              tokenPools2D[currentPage - 1]?.map((item, i) => {
                return (
                  <PoolItem
                    isActive={
                      item.attributes.address === activePool?.attributes.address
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
              })} */}
          </tbody>
        </table>
        {/* <ModalPagination
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
        /> */}
      </div>
    </div>
  );
}

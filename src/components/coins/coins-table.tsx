"use client";

import React, { useMemo, useState } from "react";
import { PoolItem as PoolItemType } from "@/types/token-pools";
import { UnifiedToken } from "@/types/coin-types";
import PoolItem from "@/components/chart/pool-item";
import PoolItemSkeleton from "@/components/chart/pool-item-skeleton";
import ModalPagination from "@/components/chart/modal-pagination";
import ChartError from "@/components/chart/chart-error";
import CoinSparkline from "./coin-sparkline";
import SkeletonLoaderWrapper from "@/components/skeleton";

type SparklineEntry = { price: string; date: number }[];

export type CoinTokenMeta = {
  logo: string;
  chainId: number;
  name: string;
  symbol: string;
};

type BaseProps = {
  data: PoolItemType[] | null;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  showSparkline?: boolean;
  sparklineData?: Map<string, SparklineEntry>;
  tokenMeta?: Map<string, CoinTokenMeta>;
  defaultChainId?: number;
};

type ClientPaginationProps = BaseProps & {
  paginationMode?: "client";
  totalPages?: never;
  currentPage?: never;
  setCurrentPage?: never;
  isLoadingMore?: never;
  isErrorMore?: never;
  isNoMore?: never;
  goBack?: never;
};

type ServerPaginationProps = BaseProps & {
  paginationMode: "server";
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  isLoadingMore: boolean;
  isErrorMore: boolean;
  isNoMore: boolean;
  goBack: () => void;
};

type Props = ClientPaginationProps | ServerPaginationProps;

function chunkArray<T>(array: T[] | null, size: number): T[][] {
  if (array === null) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

const ITEMS_PER_PAGE = 20;

const CoinsTable = (props: Props) => {
  const {
    data,
    isLoading,
    isError,
    onRetry,
    showSparkline,
    sparklineData,
    tokenMeta,
    defaultChainId,
  } = props;

  const isServer = props.paginationMode === "server";

  // Client-side pagination state
  const [clientPage, setClientPage] = useState(1);

  // Client-side chunking
  const clientPages = useMemo(
    () => (isServer ? [] : chunkArray(data, ITEMS_PER_PAGE)),
    [data, isServer]
  );

  const currentPage = isServer ? props.currentPage : clientPage;
  const setCurrentPage = isServer ? props.setCurrentPage : setClientPage;
  const totalPages = isServer ? props.totalPages : clientPages.length;

  // Current items: server mode uses data directly; client mode uses chunk
  const currentItems = isServer ? (data ?? []) : (clientPages[currentPage - 1] ?? []);
  const pageOffset = (currentPage - 1) * ITEMS_PER_PAGE;

  const showSkeleton = isLoading || (isServer && props.isLoadingMore);
  const showPageError = isServer && props.isErrorMore && !currentItems.length;

  if (showPageError) {
    return (
      <div className="modal-table" style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
        <ChartError
          btnLeftCallback={props.goBack}
          btnLeftHeader="Go Back"
          btnRightCallback={onRetry}
          btnRightHeader="Reload Data"
          mainHeader="Unable to Load Data"
          paragraph="We encountered an issue retrieving the latest data. This may be due to a temporary network problem or unavailable data from the source."
        />
      </div>
    );
  }

  return (
    <div className="modal-table">
      {isError && (
        <ChartError
          btnLeftCallback={onRetry}
          btnLeftHeader="Reload Data"
          btnRightCallback={onRetry}
          btnRightHeader="Retry"
          mainHeader="Unable to Load Data"
          paragraph="We encountered an issue retrieving the latest data. This may be due to a temporary network problem or unavailable data from the source."
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
            {showSparkline && (
              <th className="pools-modal__header__sparkline">
                <div>
                  <span>Chart</span>
                </div>
              </th>
            )}
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
          {showSkeleton &&
            Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
              <PoolItemSkeleton
                index={i + 1}
                key={i}
                afterFdv={
                  showSparkline ? (
                    <td className="pool-item__sparkline">
                      <div>
                        <SkeletonLoaderWrapper
                          radius={2}
                          height={24}
                          width={80}
                          isLoading={true}
                        />
                      </div>
                    </td>
                  ) : undefined
                }
              />
            ))}
          {!showSkeleton &&
            currentItems.map((item, i) => {
              const meta = tokenMeta?.get(item.attributes.address);
              const [fromTicker] = (item.attributes.name ?? "").split(" ");
              const activeToken: UnifiedToken | undefined = meta
                ? {
                    name: meta.name,
                    symbol: meta.symbol,
                    address: item.attributes.address,
                    logo: meta.logo,
                    chainId: meta.chainId,
                    source: "gecko",
                  }
                : defaultChainId
                  ? {
                      name: fromTicker ?? "",
                      symbol: fromTicker ?? "",
                      address: item.attributes.address,
                      chainId: defaultChainId,
                      source: "gecko",
                    }
                  : undefined;
              return (
              <PoolItem
                isActive={false}
                callback={() => {}}
                chainName={undefined}
                index={pageOffset + i + 1}
                item={item}
                activeToken={activeToken}
                key={item.attributes.address}
                afterFdv={
                  showSparkline ? (
                    <td className="pool-item__sparkline">
                      <div>
                        <CoinSparkline
                          data={
                            sparklineData?.get(item.attributes.address) ?? []
                          }
                        />
                      </div>
                    </td>
                  ) : undefined
                }
              />
              );
            })}
        </tbody>
      </table>
      <ModalPagination
        disabled={isLoading || isError || totalPages === 0}
        totalPages={totalPages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        disableItemsPerPage={true}
        disableRight={
          isServer
            ? (currentPage === totalPages &&
                (props.isNoMore || props.isErrorMore)) ||
              props.isLoadingMore
            : undefined
        }
      />
    </div>
  );
};

export default CoinsTable;

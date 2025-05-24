import { getIconUri } from "@/helpers/get-icon-uri";
import React from "react";
import { HexChain } from "../icons";
import classNames from "classnames";
import GreenDot from "../green-dot";
import SkeletonLoaderWrapper from "../skeleton";

type Props = {
  chainId: number;
  displayName: string;
  type: "eth" | "sol";
  isLoadingBalance: boolean;
  balance: string;
  isActive: boolean;
  callback?: () => void;
};

const ChainItem = ({
  chainId,
  displayName,
  isLoadingBalance,
  balance,
  isActive,
  callback,
}: Props) => {
  const [int, dec] = balance.split(".");

  return (
    <div
      className={classNames("chain-item", {
        "chain-item--active": isActive,
      })}
      key={chainId}
    >
      <div className="chain-item__info">
        <div className="chain-item__info__chain">
          <HexChain uri={getIconUri(chainId)} width={24} />
        </div>
        <div className="chain-item__info__name">
          <span>{displayName}</span>
        </div>
        <div className="chain-item__info__balance">
          <SkeletonLoaderWrapper
            radius={4}
            height={21}
            flex
            //width={"100%"}
            isLoading={isLoadingBalance}
          >
            <span>
              <GreenDot int={int} dec={dec} />
            </span>
          </SkeletonLoaderWrapper>
        </div>
      </div>
      <button
        onClick={() => callback && callback()}
        className="chain-item__select"
      >
        Select
      </button>
    </div>
  );
};

export default ChainItem;

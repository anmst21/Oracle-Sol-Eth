import React, { useMemo } from "react";
import classNames from "classnames";
import { getRandomInt } from "@/helpers/get-random-int";
import SkeletonLoaderWrapper from "../skeleton";

type Props = {
  index: number;
};

function TradeItemSkeleton({ index }: Props) {
  const randomIntOne = useMemo(() => `${getRandomInt(65, 90)}%`, []);
  const randomIntTwo = useMemo(() => `${getRandomInt(55, 75)}%`, []);
  const randomIntThree = useMemo(() => `${getRandomInt(27, 35)}%`, []);
  const randomIntFour = useMemo(() => `${getRandomInt(65, 85)}%`, []);
  const randomIntFive = useMemo(() => `${getRandomInt(55, 75)}%`, []);
  const randomIntSix = useMemo(() => `${getRandomInt(55, 75)}%`, []);
  const randomIntSeven = useMemo(() => `${getRandomInt(55, 75)}%`, []);
  const randomIntEight = useMemo(() => `${getRandomInt(55, 75)}%`, []);

  return (
    <tr className="trade-item pools-modal-loading">
      <td className="trade-item__index">
        <div>
          <span>{index}</span>
        </div>
      </td>
      <td className="trade-item__timestamp">
        <div className="trade-item__timestamp__wrapper">
          <SkeletonLoaderWrapper
            radius={2}
            height={18}
            width={randomIntOne}
            isLoading={true}
          />
          <SkeletonLoaderWrapper
            radius={2}
            height={14}
            width={randomIntTwo}
            isLoading={true}
          />
        </div>
      </td>
      <td
        className={classNames("trade-item__kind", {
          "trade-item__kind--default": true,
        })}
      >
        <SkeletonLoaderWrapper
          radius={2}
          height={21}
          width={randomIntThree}
          isLoading={true}
        />
      </td>
      <td className="trade-item__price">
        <div className="trade-item__price__wrapper">
          <SkeletonLoaderWrapper
            radius={2}
            height={18}
            width={randomIntFour}
            isLoading={true}
          />
          <SkeletonLoaderWrapper
            radius={2}
            height={14}
            width={randomIntFive}
            isLoading={true}
          />
        </div>
      </td>
      <td className="trade-item__amount">
        <div className="trade-item__amount__wrapper">
          <SkeletonLoaderWrapper
            radius={2}
            height={21}
            width={randomIntEight}
            isLoading={true}
          />
        </div>
      </td>
      <td className="trade-item__value">
        <div className="trade-item__value__wrapper">
          <SkeletonLoaderWrapper
            radius={2}
            height={21}
            width={randomIntSix}
            isLoading={true}
          />
        </div>
      </td>
      <td className="trade-item__from">
        <SkeletonLoaderWrapper
          radius={2}
          height={24}
          width={randomIntSeven}
          isLoading={true}
        />
      </td>
      <td className="trade-item__transaction">
        <SkeletonLoaderWrapper
          radius={2}
          height={24}
          width={24}
          isLoading={true}
        />
      </td>
    </tr>
  );
}

export default TradeItemSkeleton;

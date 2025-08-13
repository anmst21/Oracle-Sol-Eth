import { getRandomInt } from "@/helpers/get-random-int";
import React, { useMemo } from "react";
import SkeletonLoaderWrapper from "../skeleton";
import ChangePercentage from "./change-percentage";

type Props = {
  index: number;
};

const PoolItemSkeleton = ({ index }: Props) => {
  const randomIntOne = useMemo(() => getRandomInt(30, 50), []);
  const randomIntTwo = useMemo(() => getRandomInt(30, 50), []);
  const randomIntThree = useMemo(() => getRandomInt(30, 50), []);
  const randomIntFour = useMemo(() => getRandomInt(30, 40), []);
  const randomIntFive = useMemo(() => `${getRandomInt(40, 60)}%`, []);
  const randomIntSix = useMemo(() => `${getRandomInt(40, 60)}%`, []);
  const randomIntSeven = useMemo(() => `${getRandomInt(40, 60)}%`, []);
  const randomIntEight = useMemo(() => getRandomInt(20, 27), []);
  const randomIntNine = useMemo(() => getRandomInt(55, 85), []);
  const randomIntTen = useMemo(() => getRandomInt(40, 75), []);
  const randomIntEleven = useMemo(() => getRandomInt(80, 120), []);
  const randomIntTvelve = useMemo(() => getRandomInt(55, 85), []);

  return (
    <tr className="trade-item pool-item pool-item-skeleton">
      <td className="trade-item__index">
        <div>
          <span>{index}</span>
        </div>
      </td>
      <td>
        <div className="pool-item__pool">
          <div className="pool-item__pool__image">
            <SkeletonLoaderWrapper
              radius={1000}
              height={32}
              width={32}
              isLoading={true}
            />
          </div>
          <div className="pool-item__pool__name">
            <div className="pool-item__pool__name__top">
              <SkeletonLoaderWrapper
                radius={2}
                height={21}
                width={randomIntEleven}
                isLoading={true}
              />
            </div>
            <SkeletonLoaderWrapper
              radius={2}
              height={18.5}
              width={randomIntTvelve}
              isLoading={true}
            />
          </div>
        </div>
      </td>
      <td className="pool-item__fdv">
        <div className="pool-item__fdv__container">
          <div className="pool-item__fdv__header">
            <SkeletonLoaderWrapper
              radius={2}
              height={20}
              width={randomIntNine}
              isLoading={true}
            />
          </div>
          <div className="pool-item__fdv__bottom">
            <SkeletonLoaderWrapper
              radius={2}
              height={16}
              width={randomIntTen}
              isLoading={true}
            />
          </div>
        </div>
      </td>
      <td className="pool-item__created">
        <div>
          <SkeletonLoaderWrapper
            radius={2}
            height={21}
            width={randomIntEight}
            isLoading={true}
          />
        </div>
      </td>
      <ChangePercentage isSkeleton value={"0"} fill={randomIntOne} />
      <ChangePercentage isSkeleton value={"0"} fill={randomIntTwo} />
      <ChangePercentage isSkeleton value={"0"} fill={randomIntThree} />
      <ChangePercentage isSkeleton value={"0"} fill={randomIntFour} />
      <td className="pool-item__liq">
        <div>
          <SkeletonLoaderWrapper
            radius={2}
            height={21}
            width={randomIntSeven}
            isLoading={true}
          />
        </div>
      </td>
      <td className="pool-item__txn">
        <div>
          <SkeletonLoaderWrapper
            radius={2}
            height={21}
            width={randomIntSix}
            isLoading={true}
          />
        </div>
      </td>
      <td className="pool-item__vol">
        <div>
          <SkeletonLoaderWrapper
            radius={2}
            height={21}
            width={randomIntFive}
            isLoading={true}
          />
        </div>
      </td>
    </tr>
  );
};

export default PoolItemSkeleton;

import { getRandomInt } from "@/helpers/get-random-int";
import SkeletonLoaderWrapper from "../skeleton";
import { useMemo } from "react";
import {
  ClockInfo,
  HistoryCalendar,
  HistoryFrom,
  HistorySender,
  HistoryTo,
  SwapIcon,
} from "../icons";

const HistoryItemSkeleton = () => {
  const randomIntOne = useMemo(() => `${getRandomInt(50, 90)}%`, []);
  const randomIntTwo = useMemo(() => `${getRandomInt(30, 90)}%`, []);
  const randomIntThree = useMemo(() => `${getRandomInt(30, 90)}%`, []);
  const randomIntFour = useMemo(() => `${getRandomInt(30, 90)}%`, []);
  const randomIntFive = useMemo(() => `${getRandomInt(30, 90)}%`, []);
  const randomIntSix = useMemo(() => `${getRandomInt(25, 80)}%`, []);
  const randomIntSeven = useMemo(() => `${getRandomInt(25, 80)}%`, []);

  return (
    <div className="history-item history-item-skeleton">
      <div className="history-item__header">
        <div className="history-item__header__tx">
          <SkeletonLoaderWrapper
            radius={2}
            height={24}
            width={randomIntOne}
            isLoading={true}
          />
        </div>
        <div className="history-item__header__swap">
          <SwapIcon />
        </div>
      </div>
      <div className="history-item__section">
        <div className="history-item__key">
          <HistorySender />
          <span>Sender</span>
        </div>
        <div className="history-item__value">
          <SkeletonLoaderWrapper
            radius={2}
            height={16}
            width={randomIntTwo}
            isLoading={true}
          />
        </div>
      </div>
      <div className="history-item__section">
        <div className="history-item__key">
          <HistoryFrom />
          <span>From</span>
        </div>

        <div className="history-item__value">
          <SkeletonLoaderWrapper
            radius={2}
            height={16}
            width={randomIntThree}
            isLoading={true}
          />
        </div>
      </div>

      <div className="history-item__section">
        <div className="history-item__key">
          <HistorySender />
          <span>Recipient</span>
        </div>
        <div className="history-item__value">
          <SkeletonLoaderWrapper
            radius={2}
            height={16}
            width={randomIntFour}
            isLoading={true}
          />
        </div>
      </div>
      <div className="history-item__section">
        <div className="history-item__key">
          <HistoryTo />
          <span>To</span>
        </div>

        <div className="history-item__value">
          <SkeletonLoaderWrapper
            radius={2}
            height={16}
            width={randomIntFive}
            isLoading={true}
          />
        </div>
      </div>
      <div className="history-item__section">
        <div className="history-item__time">
          <div className="history-item__time__icon">
            <HistoryCalendar />
          </div>
          <div className="history-item__value">
            <SkeletonLoaderWrapper
              radius={2}
              height={16}
              width={randomIntSix}
              isLoading={true}
            />
          </div>
        </div>
        <div className="history-item__time">
          <div className="history-item__time__icon">
            <ClockInfo />
          </div>
          <div className="history-item__value">
            <SkeletonLoaderWrapper
              radius={2}
              height={16}
              width={randomIntSeven}
              isLoading={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItemSkeleton;

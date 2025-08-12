import React, { useState } from "react";
import SkeletonLoaderWrapper from "../skeleton";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import InfoModal from "./info-modal";
import DateModal from "./date-modal";

type Props = {
  arrayTimestamp: string[];
  item:
    | {
        key: string;
        valueDefalut: number;
        valueLeft: number;
        valueRight: number;
        fill: number;
        type: string;
        radom: string;
      }
    | {
        key: string;
        valueDefalut: React.JSX.Element;
        valueLeft: null;
        valueRight: null;
        radom: string;
        type: string;
        fill: number;
      };
  isLoading: boolean;
};

const BottomItem = ({ item, isLoading, arrayTimestamp }: Props) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <div className="chart-bottom__box">
      <div className="chart-bottom__box__top">
        <span>{item.key}</span>
      </div>
      <div
        onMouseEnter={() => !isLoading && setIsVisibleModal(true)}
        onMouseMove={() =>
          !isLoading && !isVisibleModal && setIsVisibleModal(true)
        }
        onMouseLeave={() => !isLoading && setIsVisibleModal(false)}
        className="chart-bottom__box__bottom"
      >
        <AnimatePresence mode="wait">
          {isVisibleModal &&
            (item.type === "created_at" ? (
              <DateModal
                closeModal={() => setIsVisibleModal(false)}
                arrayTimestamp={arrayTimestamp}
              />
            ) : (
              <InfoModal
                closeModal={() => setIsVisibleModal(false)}
                type={item.type}
                values={{
                  top: item.valueLeft,
                  bot: item.valueRight,
                }}
              />
            ))}
        </AnimatePresence>
        {isLoading ? (
          <SkeletonLoaderWrapper
            radius={1}
            height={18.5}
            width={item.radom}
            isLoading={true}
          />
        ) : (
          <span>{item.valueDefalut}</span>
        )}

        <div
          className={classNames("chart-bottom__box__status", {
            "chart-bottom__box__status--nobg": isLoading,
          })}
        >
          <AnimatePresence initial={true}>
            {!isLoading ? (
              <motion.div
                key={`active-${item.key}`} // forces re-animate on data refresh
                className="chart-bottom__box__status--active"
                initial={{ width: "0%", opacity: 0 }}
                animate={{ width: `${item.fill}%`, opacity: 1 }}
                //  exit={{ width: "0%", opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                  mass: 0.6,
                }}
              />
            ) : (
              <SkeletonLoaderWrapper
                radius={1}
                height={3}
                width={"100%"}
                isLoading={true}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BottomItem;

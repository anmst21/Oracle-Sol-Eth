import React, { useState } from "react";
import SkeletonLoaderWrapper from "../skeleton";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import InfoModal from "./info-modal";
import DateModal from "./date-modal";

type Props = {
  arrayTimestamp: string[];
  isError: boolean;
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

const BottomItem = ({ item, isLoading, arrayTimestamp, isError }: Props) => {
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  return (
    <div className="chart-bottom__box">
      <div className="chart-bottom__box__top">
        <span>{item.key}</span>
      </div>
      <div
        onMouseEnter={() => !isLoading && !isError && setIsVisibleModal(true)}
        onMouseMove={() =>
          !isLoading && !isVisibleModal && !isError && setIsVisibleModal(true)
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
        {isLoading || isError ? (
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
            "chart-bottom__box__status--nobg": isLoading || isError,
          })}
        >
          <AnimatePresence initial={true}>
            {isLoading || isError ? (
              <SkeletonLoaderWrapper
                radius={1}
                height={3}
                width={"100%"}
                isLoading={true}
              />
            ) : (
              <motion.div
                key={`active-${item.key}`} // forces re-animate on data refresh
                className="chart-bottom__box__status--active"
                initial={{ width: "0%", opacity: 0 }}
                animate={{ width: `${item.fill}%`, opacity: 1 }}
                //  exit={{ width: "0%", opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BottomItem;

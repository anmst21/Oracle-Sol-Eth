import React, { useMemo } from "react";
import { useChart } from "@/context/ChartProvider";
import { parseTimestampToArray } from "@/helpers/timestamp-to-array";
import { getRandomInt } from "@/helpers/get-random-int";
import BottomItem from "./bottom-item";

const Bottom = () => {
  const { isLoadingPools, activePool, isErrorPools } = useChart();

  const txData = activePool?.attributes.transactions.h24;

  const txBuys = txData?.buys || 0;
  const txSells = txData?.sells || 0;

  const totalTx = txBuys + txSells;

  const buyPercent = totalTx > 0 ? (txBuys / totalTx) * 100 : 0;

  const txBuyers = txData?.buyers || 0;
  const txSellers = txData?.sellers || 0;

  const txTotal = txBuys + txSells;
  const userTotal = txBuyers + txSellers;

  const arrayTimestamp = parseTimestampToArray(
    activePool?.attributes.pool_created_at || ""
  );

  const randomIntOne = useMemo(() => `${getRandomInt(20, 50)}%`, []);
  const randomIntTwo = useMemo(() => `${getRandomInt(20, 50)}%`, []);
  const randomIntThree = useMemo(() => `${getRandomInt(45, 75)}%`, []);

  const bottomObjects = [
    {
      key: "traders",
      valueDefalut: userTotal,
      valueLeft: txBuyers,
      valueRight: txSellers,
      fill: buyPercent,
      radom: randomIntOne,
      type: "buyers",
    },
    {
      key: "txns",
      valueDefalut: txTotal,
      valueLeft: txBuys,
      valueRight: txSells,
      radom: randomIntTwo,
      fill: buyPercent,
      type: "buys",
    },

    {
      key: "created at",
      valueDefalut: (
        <span>
          {arrayTimestamp[2]}
          <span>{arrayTimestamp[3]}</span>
        </span>
      ),
      valueLeft: null,
      valueRight: null,
      radom: randomIntThree,
      type: "created_at",
      fill: 100,
    },
  ];

  return (
    <div className="chart-bottom">
      {bottomObjects.map((item, i) => {
        return (
          <BottomItem
            isError={isErrorPools}
            arrayTimestamp={arrayTimestamp}
            item={item}
            isLoading={isLoadingPools}
            key={i}
          />
        );
      })}
    </div>
  );
};

export default Bottom;

import { useMemo } from "react";
import GreenDot from "../green-dot";
import SkeletonLoaderWrapper from "../skeleton";
import { getRandomInt } from "@/helpers/get-random-int";

const StatsItem = ({
  header,
  value,
  isLoadingPools,
}: {
  header: string;
  value: string[];
  isLoadingPools: boolean;
}) => {
  const [int, dec] = (Number(value[0]).toFixed(1) || "0.0").split(".");
  const randomInt = useMemo(() => `${getRandomInt(55, 85)}%`, []);

  return (
    <div className="stats-item">
      <div className="stats-item__key">{header}</div>
      <div className="stats-item__value">
        {isLoadingPools ? (
          <SkeletonLoaderWrapper
            radius={2}
            height={18}
            width={randomInt}
            isLoading={true}
          />
        ) : (
          <span>
            $
            <span className="stats-item__value__white">
              <GreenDot int={int} dec={dec} />
            </span>
            {value[1].toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsItem;

import React, { useMemo } from "react";
import SkeletonLoaderWrapper from "../skeleton";
import { getRandomInt } from "@/helpers/get-random-int";

const ChainSkeleton = () => {
  const randomInt = useMemo(() => getRandomInt(40, 100), []);
  return (
    <button className="chain-sidebar" disabled={true}>
      <div className="all-chains-icon">
        <SkeletonLoaderWrapper
          radius={2}
          height={24}
          width={24}
          isLoading={true}
        />
      </div>
      <SkeletonLoaderWrapper
        radius={2}
        height={24}
        width={`${randomInt}%`}
        isLoading={true}
      />
    </button>
  );
};

export default ChainSkeleton;

import React, { useMemo } from "react";
import SkeletonLoaderWrapper from "../skeleton";
import { getRandomInt } from "@/helpers/get-random-int";

const FeaturedSkeleton = () => {
  const randomInt = useMemo(() => getRandomInt(50, 120), []);
  return (
    <button disabled={true} className="featured-coin-item featured-skeleton">
      <div className="token-to-buy__token__icon">
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
        width={randomInt}
        isLoading={true}
      >
        <span>kek</span>
      </SkeletonLoaderWrapper>
    </button>
  );
};

export default FeaturedSkeleton;

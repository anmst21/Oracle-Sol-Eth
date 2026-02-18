import React from "react";
import SkeletonLoaderWrapper from "../skeleton";

const SKELETON_WIDTHS = [91, 53, 64, 75, 78, 66, 65, 77, 45, 85, 88, 52, 95];

const ChainSkeleton = ({ index = 0 }: { index?: number }) => {
  const width = SKELETON_WIDTHS[index % SKELETON_WIDTHS.length];
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
        width={`${width}%`}
        isLoading={true}
      />
    </button>
  );
};

export default ChainSkeleton;

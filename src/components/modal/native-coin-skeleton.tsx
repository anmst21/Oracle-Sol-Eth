import React, { useMemo } from "react";
import SkeletonLoaderWrapper from "../skeleton";
import { getRandomInt } from "@/helpers/get-random-int";

const NativeCoinSkeleton = () => {
  const randomIntOne = useMemo(() => getRandomInt(100, 160), []);
  const randomIntTwo = useMemo(() => getRandomInt(70, 140), []);
  const randomIntThree = useMemo(() => getRandomInt(50, 120), []);
  const randomIntFour = useMemo(() => getRandomInt(20, 50), []);
  const randomIntFive = useMemo(() => getRandomInt(60, 100), []);

  return (
    <button disabled={true} className="native-coin native-coin-skeleton">
      <SkeletonLoaderWrapper
        radius={2}
        height={34}
        width={34}
        isLoading={true}
      />

      <div className="native-coin__meta">
        <SkeletonLoaderWrapper
          radius={2}
          height={16}
          width={randomIntOne}
          isLoading={true}
        />
        <div className="native-coin__meta__bot">
          <SkeletonLoaderWrapper
            radius={2}
            height={13}
            width={randomIntThree}
            isLoading={true}
          />
          <SkeletonLoaderWrapper
            radius={2}
            height={13}
            width={randomIntFour}
            isLoading={true}
          />
        </div>
      </div>

      <div className="native-coin__balance">
        <SkeletonLoaderWrapper
          radius={2}
          height={16}
          width={randomIntTwo}
          isLoading={true}
        />
        <span>
          <SkeletonLoaderWrapper
            radius={2}
            height={13}
            width={randomIntFive}
            isLoading={true}
          />
          <span className="coin-ticker">
            <SkeletonLoaderWrapper
              radius={2}
              height={13}
              width={13}
              isLoading={true}
            />
          </span>
        </span>
      </div>
    </button>
  );
};

export default NativeCoinSkeleton;

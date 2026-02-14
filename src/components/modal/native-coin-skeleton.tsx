import React, { useMemo } from "react";
import SkeletonLoaderWrapper from "../skeleton";
import { getRandomInt } from "@/helpers/get-random-int";
import { useIsDesktop } from "@/hooks/useIsDesktop";

const NativeCoinSkeleton = () => {
  const isDesktop = useIsDesktop();

  const randomIntOne = useMemo(
    () => (isDesktop ? getRandomInt(100, 160) : getRandomInt(60, 100)),
    [isDesktop]
  );
  const randomIntTwo = useMemo(
    () => (isDesktop ? getRandomInt(70, 140) : getRandomInt(40, 80)),
    [isDesktop]
  );
  const randomIntThree = useMemo(
    () => (isDesktop ? getRandomInt(50, 120) : getRandomInt(30, 70)),
    [isDesktop]
  );
  const randomIntFour = useMemo(
    () => (isDesktop ? getRandomInt(20, 50) : getRandomInt(15, 30)),
    [isDesktop]
  );
  const randomIntFive = useMemo(
    () => (isDesktop ? getRandomInt(60, 100) : getRandomInt(30, 60)),
    [isDesktop]
  );

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

import React, { useMemo } from "react";
import {
  SwapIcon,
  FeedCalendar,
  ExplorerFeed,
  ArrowSmall,
  FeedChange,
} from "../icons";

import { getRandomInt } from "@/helpers/get-random-int";
import SkeletonLoaderWrapper from "../skeleton";

const FeedPostSkeleton = () => {
  const randomIntOne = useMemo(() => `${getRandomInt(50, 90)}%`, []);
  const randomIntTwo = useMemo(() => `${getRandomInt(30, 90)}%`, []);

  const randomIntFive = useMemo(() => `${getRandomInt(30, 90)}%`, []);

  return (
    <div className="feed-post feed-post-skeleton">
      <div className="feed-post__header">
        <div className="feed-post__header__pfp">
          <SkeletonLoaderWrapper
            radius={1000}
            height={24}
            width={24}
            isLoading={true}
          />
        </div>
        <div className="feed-post__header__username">
          <SkeletonLoaderWrapper
            radius={2}
            height={20}
            width={randomIntOne}
            isLoading={true}
          />
        </div>
        <button disabled className="feed-post__header__swap">
          <SwapIcon />
          Swap
        </button>
      </div>
      <div className="feed-post__main">
        <div className="feed-post__left">
          <div className="feed-post__main">
            <div className="feed-post__section">
              <div className="feed-post__section__header">
                <span>SWAPPED</span>
                <ArrowSmall />
              </div>
              <div className="feed-post__section__main">
                <SkeletonLoaderWrapper
                  radius={2}
                  height={18}
                  width={randomIntTwo}
                  isLoading={true}
                />
              </div>
            </div>
          </div>
          <div className="feed-post__bottom">
            <div className="feed-post__bottom__icon">
              <FeedCalendar />
            </div>
            <div className="feed-post__bottom__section">
              <SkeletonLoaderWrapper
                radius={2}
                height={16}
                width={"100%"}
                isLoading={true}
              />
            </div>
            <div className="feed-post__bottom__section feed-post__bottom__section--time">
              <SkeletonLoaderWrapper
                radius={2}
                height={16}
                width={"100%"}
                isLoading={true}
              />
            </div>
          </div>
        </div>
        <div className="feed-post__left">
          <div className="feed-post__main">
            <div className="feed-post__section">
              <div className="feed-post__section__header">
                <span>FOR</span>
              </div>
              <div className="feed-post__section__main">
                <SkeletonLoaderWrapper
                  radius={2}
                  height={18}
                  width={randomIntFive}
                  isLoading={true}
                />
              </div>
            </div>
          </div>
          <div className="feed-post__bottom">
            <div className="feed-post__bottom__icon">
              <FeedChange />
            </div>
            <div className="feed-post__bottom__section feed-post__bottom__section--time">
              <SkeletonLoaderWrapper
                radius={2}
                height={18}
                width={"100%"}
                isLoading={true}
              />
            </div>

            <div className="feed-post__bottom__section feed-post__bottom__section--btn">
              <SkeletonLoaderWrapper
                radius={2}
                height={18}
                width={"100%"}
                isLoading={true}
              />
              <ExplorerFeed />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPostSkeleton;

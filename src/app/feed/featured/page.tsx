"use client";

import ChartError from "@/components/chart/chart-error";
import FeedPost from "@/components/feed/feed-post";
import { useFeed } from "@/context/FeedProvider";
import { RelayTokenMeta } from "@/types/relay-token-meta";
import { useScroll } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { farcasterFeedUsers } from "@/helpers/test-farcaster-feed-users";
import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayChainFetch } from "@/types/relay-chain";
import FeedPostSkeleton from "@/components/feed/feed-post-skeleton";
import classNames from "classnames";

export default function Page() {
  const { back } = useRouter();

  const { chains, isLoading: isLoadingChains } = useRelayChains();

  const {
    loadFeaturedFeed,
    featuredFeed,
    cursor,
    metaByKey,
    isLoadingFeaturedFeed,
    isLoadingMoreFeaturedFeed,
    isErrorFeaturedFeed,
  } = useFeed();

  useEffect(() => {
    if (!featuredFeed) loadFeaturedFeed();
  }, [featuredFeed]);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  useEffect(() => {
    return scrollYProgress.onChange((progress) => {
      if (progress > 0.9 && cursor && !isLoadingMoreFeaturedFeed) {
        loadFeaturedFeed({ cursor: cursor ? cursor : undefined });
      }
    });
  }, [scrollYProgress, cursor, isLoadingMoreFeaturedFeed, loadFeaturedFeed]);

  return (
    <div
      className={classNames("feed-page", {
        "feed-page--error": isErrorFeaturedFeed,
      })}
      ref={containerRef}
    >
      {!isLoadingFeaturedFeed &&
        !isLoadingChains &&
        chains &&
        featuredFeed &&
        featuredFeed.map((item, i) => {
          const fromToken = item.tokenFromKey;
          const toToken = item.tokenToKey;

          let fromMeta: RelayTokenMeta | null = null;
          let toMeta: RelayTokenMeta | null = null;
          if (fromToken) {
            fromMeta = metaByKey[fromToken];
          }
          if (toToken) {
            toMeta = metaByKey[toToken];
          }

          const chainItem = chains.find((chain) => chain.id === item.chainId);

          return (
            <FeedPost
              chainItem={chainItem as RelayChainFetch}
              farcasterUser={farcasterFeedUsers[i % farcasterFeedUsers.length]}
              fromMeta={fromMeta}
              toMeta={toMeta}
              item={item}
              key={i}
            />
          );
        })}
      {isErrorFeaturedFeed && (
        <ChartError
          btnLeftCallback={() => loadFeaturedFeed()}
          btnLeftHeader={"Reload Feed"}
          btnRightCallback={() => back()}
          btnRightHeader={"Go Back"}
          mainHeader={"Unable to Load Feed"}
          paragraph={
            "We encountered an issue retrieving the latest feed data. This may be due to a temporary network problem or unavailable data from the source."
          }
        />
      )}
      {(isLoadingFeaturedFeed || isLoadingMoreFeaturedFeed) &&
        Array.from({ length: 10 }).map((_, i) => <FeedPostSkeleton key={i} />)}
    </div>
  );
}

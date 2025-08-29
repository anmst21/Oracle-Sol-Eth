"use client";

import { fetchFeedEnriched } from "@/actions/fetch-feed-enriched";
import { DexEntry } from "@/types/feed-api-response";
import {
  EnrichedDexEntry,
  MetaByKey,
  TokenKey,
} from "@/types/relay-token-meta";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from "react";

export interface FeedContextType {
  featuredFeed: EnrichedDexEntry[] | null;
  isLoadingFeaturedFeed: boolean;
  isErrorFeaturedFeed: boolean;
  isLoadingMoreFeaturedFeed: boolean;
  loadFeaturedFeed: (
    opts?:
      | {
          cursor?: string | undefined;
        }
      | undefined
  ) => Promise<void>;
  metaByKey: MetaByKey;
  cursor: string | null;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export interface FeedProviderProps {
  children: ReactNode;
}

//  entries: EnrichedDexEntry[];
//   /** All unique keys encountered in this page (lowercase) */
//   uniqueKeys: TokenKey[];
//   /** Subset of uniqueKeys that are NOT in alreadyFetchedKeys (lowercase), capped per call */

//   metaByKey: MetaByKey;

export const FeedProvider: React.FC<FeedProviderProps> = ({ children }) => {
  const [featuredFeed, setFeaturedFeed] = useState<EnrichedDexEntry[] | null>(
    null
  );
  const [uniqueKeys, setUniqueKeys] = useState<TokenKey[] | null>(null);
  const [metaByKey, setMetaByKey] = useState<MetaByKey>({});
  const [cursor, setCursor] = useState<string | null>(null);

  const [isLoadingFeaturedFeed, setIsLoadingFeaturedFeed] = useState(false);
  const [isLoadingMoreFeaturedFeed, setIsLoadingMoreFeaturedFeed] =
    useState(false);
  const [isErrorFeaturedFeed, setIsErrorFeaturedFeed] = useState(false);

  const loadFeaturedFeed = useCallback(
    async (opts?: { cursor?: string }) => {
      const isLoadMore = Boolean(opts?.cursor);
      try {
        if (isLoadMore) setIsLoadingMoreFeaturedFeed(true);
        else setIsLoadingFeaturedFeed(true);

        setIsErrorFeaturedFeed(false);

        const {
          entries,
          uniqueKeys: pageKeys,
          metaByKey: pageMeta,
          nextCursor,
        } = await fetchFeedEnriched({
          cursor: opts?.cursor,
          alreadyFetchedKeys: uniqueKeys ?? [],
        });

        // Merge cursor
        setCursor(nextCursor ?? null);

        // Merge unique keys (union)
        setUniqueKeys((prev) => {
          const set = new Set<TokenKey>(prev ?? []);
          for (const k of pageKeys) set.add(k);
          return Array.from(set);
        });

        // Merge metaByKey (new wins)
        setMetaByKey((prev) => ({ ...prev, ...pageMeta }));

        // Merge feed entries
        setFeaturedFeed((prev) => {
          if (isLoadMore && prev) {
            // append + dedupe by id (keep latest)
            const byId = new Map<string, EnrichedDexEntry>();
            for (const e of prev) byId.set(e.id, e);
            for (const e of entries) byId.set(e.id, e);
            return Array.from(byId.values());
          }
          return entries; // first page / refresh
        });
      } catch (err) {
        console.error("loadFeaturedFeed error:", err);
        setIsErrorFeaturedFeed(true);
      } finally {
        if (isLoadMore) setIsLoadingMoreFeaturedFeed(false);
        else setIsLoadingFeaturedFeed(false);
      }
    },
    [uniqueKeys]
  );

  return (
    <FeedContext.Provider
      value={{
        featuredFeed,
        isLoadingFeaturedFeed,
        isErrorFeaturedFeed,
        isLoadingMoreFeaturedFeed,
        loadFeaturedFeed,
        metaByKey,
        cursor,
      }}
    >
      {children}
      {/* <AnimatePresence mode="wait">
        {isOpenPools && <PoolsModal closeModal={() => setIsOpenPools(false)} />}
      </AnimatePresence>
     */}
    </FeedContext.Provider>
  );
};

export const useFeed = (): FeedContextType => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within a FeedProvider");
  }
  return context;
};

export default FeedProvider;

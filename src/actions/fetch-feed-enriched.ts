"use server";

import { DexEntry, DexResponse } from "@/types/feed-api-response";
import {
  EnrichedDexEntry,
  MetaByKey,
  RelayTokenMeta,
  TokenKey,
} from "@/types/relay-token-meta";

interface FetchEnrichedResult {
  entries: EnrichedDexEntry[];
  /** All unique keys encountered in this page (lowercase) */
  uniqueKeys: TokenKey[];
  /** Subset of uniqueKeys that are NOT in alreadyFetchedKeys (lowercase), capped per call */

  metaByKey: MetaByKey;
  /** Cursor from response body or header if available */
  nextCursor?: string;
}

const FEED_URL = "https://api.oracleswap.app/feed/power";
const RELAY_URL = "https://api.relay.link/currencies/v2";

/** Keep batch sizes modest to avoid over-fetching Relay in one call */
const NEW_KEYS_LIMIT = 50;

/** Lowercase-normalize a hex address; returns undefined for falsy/invalid inputs */
function normalizeAddress(addr?: string | null): string | undefined {
  if (!addr) return undefined;
  const s = String(addr).trim();
  // Accept 0x-prefixed 40-hex
  const m = /^0x[a-fA-F0-9]{40}$/.exec(s);
  return m ? s.toLowerCase() : undefined;
}

export const fetchFeedEnriched = async (params?: {
  cursor?: string;
  alreadyFetchedKeys?: string[];
}): Promise<FetchEnrichedResult> => {
  const { cursor, alreadyFetchedKeys = [] } = params ?? {};

  const url = new URL(FEED_URL);
  if (cursor) url.searchParams.set("cursor", cursor);

  const feedRes = await fetch(url.toString(), {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!feedRes.ok) {
    throw new Error(
      `Feed request failed: ${feedRes.status} ${feedRes.statusText}`
    );
  }

  // Body may include nextCursor; we also check header as a fallback.
  const { entries: feedItems } = (await feedRes.json()) as DexResponse;
  const nextCursor = feedItems[feedItems.length - 1].id;

  // Build token keys per entry and collect unique keys for this page.
  const pageKeySet = new Set<TokenKey>();
  const entries: EnrichedDexEntry[] = feedItems.map((it: DexEntry) => {
    const from = normalizeAddress(it.tokenFrom);
    const to = normalizeAddress(it.tokenTo);

    const tokenFromKey = from
      ? (`${it.chainId}:${from}` as TokenKey)
      : undefined;
    const tokenToKey = to ? (`${it.chainId}:${to}` as TokenKey) : undefined;

    if (tokenFromKey) pageKeySet.add(tokenFromKey);
    if (tokenToKey) pageKeySet.add(tokenToKey);

    return { ...it, tokenFromKey, tokenToKey };
  });

  // Unique keys observed in THIS page (lowercased).
  const uniqueKeys = Array.from(pageKeySet);

  // Normalize incoming already-fetched keys to lowercase to ensure set membership is consistent.
  const alreadySet = new Set<TokenKey>(
    alreadyFetchedKeys.map((k) => k.toLowerCase() as TokenKey)
  );

  // Fresh keys we haven't fetched yet — keep this short/bounded.
  const newKeysFetched = uniqueKeys
    .filter((k) => !alreadySet.has(k))
    .slice(0, NEW_KEYS_LIMIT);

  // Placeholder: fill this after calling Relay with `newKeysFetched`.
  const metaByKey: MetaByKey = {};

  // If you want the *union* of old+new keys for your caller's cache:
  // const allKeys = Array.from(new Set<TokenKey>([...alreadySet, ...uniqueKeys]));

  // Example Relay fetch (uncomment when ready; API expects `${chainId}:${address}` keys):
  if (newKeysFetched.length) {
    const relayRes = await fetch(RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokens: newKeysFetched }),
    });
    if (!relayRes.ok) {
      console.warn("Relay lookup failed", relayRes.status, relayRes.statusText);
    } else {
      const data = (await relayRes.json()) as RelayTokenMeta[];
      for (const meta of data) {
        // Assuming meta carries its own key; otherwise derive from meta.chainId/meta.address.
        const key = `${meta.chainId}:${(
          meta.address as string
        ).toLowerCase()}` as TokenKey;
        metaByKey[key] = meta;
      }
    }
  }

  return {
    entries,
    uniqueKeys,
    metaByKey,
    nextCursor,
  };
};

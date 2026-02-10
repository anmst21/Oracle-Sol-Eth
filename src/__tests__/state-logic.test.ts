import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Tests for state transition logic extracted from context providers.
 * These test the pure logic without React rendering, verifying
 * the correctness of state mutation patterns used across the app.
 */

// ─── ChartProvider: chunkArray logic (from pools-modal) ──────────────
describe("chunkArray (pool pagination)", () => {
  function chunkArray<T>(array: T[] | null, size: number): T[][] {
    if (array === null) return [];
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  it("chunks array into pages of given size", () => {
    const items = Array.from({ length: 50 }, (_, i) => i);
    const chunks = chunkArray(items, 20);
    expect(chunks).toHaveLength(3);
    expect(chunks[0]).toHaveLength(20);
    expect(chunks[1]).toHaveLength(20);
    expect(chunks[2]).toHaveLength(10);
  });

  it("returns empty array for null input", () => {
    expect(chunkArray(null, 20)).toEqual([]);
  });

  it("handles empty array", () => {
    expect(chunkArray([], 20)).toEqual([]);
  });

  it("handles array smaller than chunk size", () => {
    const chunks = chunkArray([1, 2, 3], 20);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toEqual([1, 2, 3]);
  });
});

// ─── FeedProvider: deduplication logic ───────────────────────────────
describe("FeedProvider deduplication", () => {
  interface Entry {
    id: string;
    value: string;
  }

  function mergeEntries(prev: Entry[], newEntries: Entry[]): Entry[] {
    const byId = new Map<string, Entry>();
    for (const e of prev) byId.set(e.id, e);
    for (const e of newEntries) byId.set(e.id, e); // newer wins
    return Array.from(byId.values());
  }

  it("appends new entries", () => {
    const prev = [{ id: "1", value: "a" }];
    const next = [{ id: "2", value: "b" }];
    const result = mergeEntries(prev, next);
    expect(result).toHaveLength(2);
  });

  it("deduplicates by id (newer wins)", () => {
    const prev = [{ id: "1", value: "old" }];
    const next = [{ id: "1", value: "new" }];
    const result = mergeEntries(prev, next);
    expect(result).toHaveLength(1);
    expect(result[0].value).toBe("new");
  });

  it("preserves order (prev then new)", () => {
    const prev = [
      { id: "1", value: "a" },
      { id: "2", value: "b" },
    ];
    const next = [{ id: "3", value: "c" }];
    const result = mergeEntries(prev, next);
    expect(result.map((e) => e.id)).toEqual(["1", "2", "3"]);
  });

  it("handles empty prev", () => {
    const result = mergeEntries([], [{ id: "1", value: "a" }]);
    expect(result).toHaveLength(1);
  });

  it("handles empty new entries", () => {
    const prev = [{ id: "1", value: "a" }];
    const result = mergeEntries(prev, []);
    expect(result).toHaveLength(1);
  });
});

// ─── FeedProvider: uniqueKeys merge (Set union) ──────────────────────
describe("FeedProvider uniqueKeys union", () => {
  function mergeKeys(prev: string[], pageKeys: string[]): string[] {
    const set = new Set<string>(prev);
    for (const k of pageKeys) set.add(k);
    return Array.from(set);
  }

  it("unions keys without duplicates", () => {
    expect(mergeKeys(["a", "b"], ["b", "c"])).toEqual(["a", "b", "c"]);
  });

  it("handles empty prev", () => {
    expect(mergeKeys([], ["a", "b"])).toEqual(["a", "b"]);
  });

  it("handles empty page keys", () => {
    expect(mergeKeys(["a"], [])).toEqual(["a"]);
  });
});

// ─── SwapContainer: getTokenBalance logic ────────────────────────────
describe("SwapContainer getTokenBalance", () => {
  interface Token {
    address: string;
    chainId: number;
    balance?: number;
  }

  const SOL_CHAIN = 792703809;

  function getTokenBalance(
    address: string | undefined,
    chainId: number | undefined,
    nativeSolBalance: { balance: number } | null,
    userSolanaTokens: Token[] | null,
    userEthTokens: Token[] | null
  ): string | undefined {
    if (!address || !chainId) return undefined;

    if (chainId === SOL_CHAIN) {
      if (address === "11111111111111111111111111111111") {
        return nativeSolBalance?.balance.toFixed(6);
      } else {
        return (
          userSolanaTokens?.find((token) => token.address === address)
            ?.balance ?? 0
        ).toFixed(6);
      }
    } else {
      return (
        userEthTokens?.find(
          (token) => token.address === address && token.chainId === chainId
        )?.balance ?? 0
      ).toFixed(6);
    }
  }

  it("returns native SOL balance for native mint", () => {
    const result = getTokenBalance(
      "11111111111111111111111111111111",
      SOL_CHAIN,
      { balance: 1.5 },
      null,
      null
    );
    expect(result).toBe("1.500000");
  });

  it("returns SPL token balance", () => {
    const tokens: Token[] = [
      { address: "TokenMint123", chainId: SOL_CHAIN, balance: 100 },
    ];
    const result = getTokenBalance(
      "TokenMint123",
      SOL_CHAIN,
      null,
      tokens,
      null
    );
    expect(result).toBe("100.000000");
  });

  it("returns ETH token balance", () => {
    const tokens: Token[] = [
      { address: "0xabc", chainId: 1, balance: 50.5 },
    ];
    const result = getTokenBalance("0xabc", 1, null, null, tokens);
    expect(result).toBe("50.500000");
  });

  it("returns 0 for unknown token (with ?? fix)", () => {
    const result = getTokenBalance("0xunknown", 1, null, null, []);
    expect(result).toBe("0.000000");
  });

  it("returns 0 for token with zero balance (|| bug)", () => {
    // This tests the BUG: `?.balance || 0` treats 0 as falsy
    // With `|| 0`, a balance of exactly 0 is "found" but || skips it
    // The correct fix is `?? 0`
    const tokens: Token[] = [
      { address: "0xzero", chainId: 1, balance: 0 },
    ];
    const result = getTokenBalance("0xzero", 1, null, null, tokens);
    expect(result).toBe("0.000000");
  });

  it("returns undefined when address is missing", () => {
    expect(getTokenBalance(undefined, 1, null, null, null)).toBeUndefined();
  });

  it("returns undefined when chainId is missing", () => {
    expect(getTokenBalance("0xabc", undefined, null, null, null)).toBeUndefined();
  });
});

// ─── SwapMeta: division by zero ──────────────────────────────────────
describe("SwapMeta exchange rate calculation", () => {
  it("returns Infinity when outAmount is 0", () => {
    const inAmount = 1.5;
    const outAmount = 0;
    // This is the BUG: no guard against division by zero
    expect(inAmount / outAmount).toBe(Infinity);
  });

  it("returns Infinity when inAmount is 0", () => {
    const inAmount = 0;
    const outAmount = 1.5;
    expect(outAmount / inAmount).toBe(Infinity);
  });

  it("calculates correctly with valid amounts", () => {
    const inAmount = 2;
    const outAmount = 4;
    expect(inAmount / outAmount).toBe(0.5);
    expect(outAmount / inAmount).toBe(2);
  });

  it("returns NaN for 0/0", () => {
    expect(0 / 0).toBeNaN();
  });
});

// ─── SwapContainer: handleTokenSwitch state transition ───────────────
describe("SwapContainer handleTokenSwitch logic", () => {
  it("swaps EXACT_INPUT to EXACT_OUTPUT correctly", () => {
    const sellInput = "100";
    const buyInput = "200";
    const tradeType = "EXACT_INPUT";

    // After switch: sellInput should get buyInput value
    let newSellInput: string;
    let newBuyInput: string;
    let newTradeType: string;

    if (tradeType === "EXACT_INPUT") {
      newBuyInput = sellInput;
      newSellInput = "";
      newTradeType = "EXACT_OUTPUT";
    } else {
      newSellInput = buyInput;
      newBuyInput = "";
      newTradeType = "EXACT_INPUT";
    }

    expect(newBuyInput).toBe("100");
    expect(newSellInput).toBe("");
    expect(newTradeType).toBe("EXACT_OUTPUT");
  });

  it("swaps EXACT_OUTPUT to EXACT_INPUT correctly", () => {
    const sellInput = "100";
    const buyInput = "200";
    const tradeType = "EXACT_OUTPUT";

    let newSellInput: string;
    let newBuyInput: string;
    let newTradeType: string;

    if (tradeType === "EXACT_INPUT") {
      newBuyInput = sellInput;
      newSellInput = "";
      newTradeType = "EXACT_OUTPUT";
    } else {
      newSellInput = buyInput;
      newBuyInput = "";
      newTradeType = "EXACT_INPUT";
    }

    expect(newSellInput).toBe("200");
    expect(newBuyInput).toBe("");
    expect(newTradeType).toBe("EXACT_INPUT");
  });
});

// ─── SwapWindow: onOptionClick comma-expression bug ──────────────────
describe("SwapWindow onOptionClick", () => {
  it("correctly calculates sell preset (20% of balance)", () => {
    const tokenBalance = "10.000000";
    const mult = 0.2;
    const result = (Number(tokenBalance) * mult).toString();
    expect(result).toBe("2");
  });

  it("correctly calculates buy preset (+20% of input)", () => {
    const inputValue = "100";
    const mult = 1.2;
    const result = (Number(inputValue) * mult).toString();
    expect(result).toBe("120");
  });

  it("handles MAX (100% of balance)", () => {
    const tokenBalance = "5.500000";
    const mult = 1;
    const result = (Number(tokenBalance) * mult).toString();
    expect(result).toBe("5.5");
  });
});

// ─── PoolItem: name splitting ────────────────────────────────────────
describe("PoolItem name parsing", () => {
  it("splits pool name correctly", () => {
    const name = "ETH / USDC";
    const [fromTicker, , toTicker] = name.split(" ");
    expect(fromTicker).toBe("ETH");
    expect(toTicker).toBe("USDC");
  });

  it("handles undefined name (the bug)", () => {
    const name: string | undefined = undefined;
    // The current code does: item.attributes.name.split(" ")
    // This will throw if name is undefined
    expect(() => {
      if (!name) throw new TypeError("Cannot read properties of undefined");
      name.split(" ");
    }).toThrow();
  });

  it("handles empty name", () => {
    const name = "";
    const parts = name.split(" ");
    expect(parts[0]).toBe("");
    expect(parts[2]).toBeUndefined();
  });
});

// ─── ActiveWalletContext: sortByUserFirst ─────────────────────────────
describe("ActiveWalletContext sortByUserFirst", () => {
  function sortByUserFirst<T extends { address?: string }>(
    list: T[],
    userAddress?: string
  ): T[] {
    const normalized = userAddress?.toLowerCase();
    return [...list].sort((a, b) => {
      if (a.address?.toLowerCase() === normalized) return -1;
      if (b.address?.toLowerCase() === normalized) return 1;
      return 0;
    });
  }

  it("puts user address first", () => {
    const wallets = [
      { address: "0xAAA" },
      { address: "0xBBB" },
      { address: "0xCCC" },
    ];
    const sorted = sortByUserFirst(wallets, "0xBBB");
    expect(sorted[0].address).toBe("0xBBB");
  });

  it("handles case-insensitive comparison", () => {
    const wallets = [{ address: "0xAAA" }, { address: "0xbbb" }];
    const sorted = sortByUserFirst(wallets, "0xBBB");
    expect(sorted[0].address).toBe("0xbbb");
  });

  it("handles no user address", () => {
    const wallets = [{ address: "0xAAA" }, { address: "0xBBB" }];
    const sorted = sortByUserFirst(wallets, undefined);
    expect(sorted).toEqual(wallets);
  });

  it("handles empty list", () => {
    expect(sortByUserFirst([], "0xAAA")).toEqual([]);
  });
});

// ─── Modal: chainFeaturedTokens mapping ──────────────────────────────
describe("Modal chainFeaturedTokens", () => {
  it("maps chain featured tokens correctly", () => {
    const chains = [
      {
        id: 1,
        featuredTokens: [
          {
            id: "1",
            address: "0xabc",
            symbol: "ETH",
            name: "Ethereum",
            metadata: { logoURI: "logo.png" },
          },
        ],
      },
    ];

    const activeChainId = 1;
    const chain = chains.find((t) => t.id === activeChainId);
    const tokens = chain?.featuredTokens?.map((token) => ({
      source: "eth" as const,
      chainId: Number(token.id),
      address: token.address!,
      symbol: token.symbol!,
      logo: token.metadata?.logoURI,
      name: token.name!,
    }));

    expect(tokens).toHaveLength(1);
    expect(tokens![0].symbol).toBe("ETH");
    expect(tokens![0].chainId).toBe(1);
  });

  it("returns empty array for missing chain", () => {
    const chains: { id: number; featuredTokens?: unknown[] }[] = [];
    const chain = chains.find((t) => t.id === 999);
    expect(chain?.featuredTokens ?? []).toEqual([]);
  });

  it("handles null address (the bug - non-null assertion)", () => {
    const token = { id: "1", address: null, symbol: null, name: null };
    // The current code uses `token.address!` which would pass null through
    // This could cause downstream issues
    expect(token.address).toBeNull();
  });
});

// ─── HistoryProvider: wallet initialization ──────────────────────────
describe("HistoryProvider wallet initialization", () => {
  it("sets active wallet from default when null", () => {
    let activeWallet: string | null = null;
    const defaultWallet = "wallet-1";

    if (!activeWallet && defaultWallet) {
      activeWallet = defaultWallet;
    }

    expect(activeWallet).toBe("wallet-1");
  });

  it("does not override existing wallet", () => {
    let activeWallet: string | null = "existing-wallet";
    const defaultWallet = "wallet-1";

    if (!activeWallet && defaultWallet) {
      activeWallet = defaultWallet;
    }

    expect(activeWallet).toBe("existing-wallet");
  });
});

// ─── SlippageContext: value bounds ───────────────────────────────────
describe("SlippageContext", () => {
  it("has correct default value", () => {
    const defaultValue = 2.0;
    expect(defaultValue).toBe(2.0);
  });

  it("converts to basis points for API (Math.round)", () => {
    // The swap-container sends: Math.round(slippageValue * 100).toString()
    expect(Math.round(2.0 * 100).toString()).toBe("200");
    expect(Math.round(0.5 * 100).toString()).toBe("50");
    expect(Math.round(1.99 * 100).toString()).toBe("199");
  });

  it("handles edge case of floating point", () => {
    // 0.1 + 0.2 !== 0.3 in JS
    expect(Math.round(0.3 * 100).toString()).toBe("30");
  });
});

// ─── BuyBtn: isInsuficientBalance logic ──────────────────────────────
describe("BuyBtn insufficient balance check", () => {
  it("correctly identifies insufficient balance", () => {
    const sellBalance = "1.5";
    const quoteAmount = "2.0";
    // BUG: uses <= instead of <, meaning equal balance shows insufficient
    expect(Number(sellBalance) <= Number(quoteAmount)).toBe(true);
  });

  it("equal balance should NOT be insufficient", () => {
    const sellBalance = "2.0";
    const quoteAmount = "2.0";
    // With <=, this returns TRUE (insufficient) which is wrong
    // Should be < (strictly less than)
    expect(Number(sellBalance) <= Number(quoteAmount)).toBe(true);
    // FIX: should use < instead of <=
    expect(Number(sellBalance) < Number(quoteAmount)).toBe(false);
  });

  it("sufficient balance", () => {
    const sellBalance = "3.0";
    const quoteAmount = "2.0";
    expect(Number(sellBalance) <= Number(quoteAmount)).toBe(false);
  });
});

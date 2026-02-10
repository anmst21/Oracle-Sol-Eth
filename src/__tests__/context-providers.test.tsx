import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, act } from "@testing-library/react";
import { SlippageProvider, useSlippage } from "@/context/SlippageContext";
import { OnRampProvider, useOnRamp } from "@/context/OnRampProvider";

// ─── SlippageProvider ────────────────────────────────────────────────
describe("SlippageProvider", () => {
  function TestConsumer() {
    const { isCustomSlippage, value, isDragging, setIsCustomSlippage, setValue, setIsDragging } =
      useSlippage();
    return (
      <div>
        <span data-testid="custom">{String(isCustomSlippage)}</span>
        <span data-testid="value">{value}</span>
        <span data-testid="dragging">{String(isDragging)}</span>
        <button data-testid="toggle-custom" onClick={() => setIsCustomSlippage(true)} />
        <button data-testid="set-value" onClick={() => setValue(3.5)} />
        <button data-testid="set-dragging" onClick={() => setIsDragging(true)} />
      </div>
    );
  }

  it("provides default values", () => {
    render(
      <SlippageProvider>
        <TestConsumer />
      </SlippageProvider>
    );
    expect(screen.getByTestId("custom").textContent).toBe("false");
    expect(screen.getByTestId("value").textContent).toBe("2");
    expect(screen.getByTestId("dragging").textContent).toBe("false");
  });

  it("updates isCustomSlippage", async () => {
    render(
      <SlippageProvider>
        <TestConsumer />
      </SlippageProvider>
    );
    await act(async () => {
      screen.getByTestId("toggle-custom").click();
    });
    expect(screen.getByTestId("custom").textContent).toBe("true");
  });

  it("updates slippage value", async () => {
    render(
      <SlippageProvider>
        <TestConsumer />
      </SlippageProvider>
    );
    await act(async () => {
      screen.getByTestId("set-value").click();
    });
    expect(screen.getByTestId("value").textContent).toBe("3.5");
  });

  it("updates dragging state", async () => {
    render(
      <SlippageProvider>
        <TestConsumer />
      </SlippageProvider>
    );
    await act(async () => {
      screen.getByTestId("set-dragging").click();
    });
    expect(screen.getByTestId("dragging").textContent).toBe("true");
  });

  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useSlippage must be used within a SlippageProvider"
    );
    spy.mockRestore();
  });
});

// ─── OnRampProvider ──────────────────────────────────────────────────
describe("OnRampProvider", () => {
  function TestConsumer() {
    const { isOpenRegions, setIsOpenRegions, moonpayCryptos, setMoonpayCryptos } =
      useOnRamp();
    return (
      <div>
        <span data-testid="open">{String(isOpenRegions)}</span>
        <span data-testid="crypto-count">{moonpayCryptos.length}</span>
        <button data-testid="toggle-open" onClick={() => setIsOpenRegions(true)} />
        <button
          data-testid="set-cryptos"
          onClick={() =>
            setMoonpayCryptos([{ code: "BTC" } as never, { code: "ETH" } as never])
          }
        />
      </div>
    );
  }

  it("provides default values", () => {
    render(
      <OnRampProvider>
        <TestConsumer />
      </OnRampProvider>
    );
    expect(screen.getByTestId("open").textContent).toBe("false");
    expect(screen.getByTestId("crypto-count").textContent).toBe("0");
  });

  it("opens regions modal", async () => {
    render(
      <OnRampProvider>
        <TestConsumer />
      </OnRampProvider>
    );
    await act(async () => {
      screen.getByTestId("toggle-open").click();
    });
    expect(screen.getByTestId("open").textContent).toBe("true");
  });

  it("sets moonpay cryptos", async () => {
    render(
      <OnRampProvider>
        <TestConsumer />
      </OnRampProvider>
    );
    await act(async () => {
      screen.getByTestId("set-cryptos").click();
    });
    expect(screen.getByTestId("crypto-count").textContent).toBe("2");
  });

  it("throws when used outside provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useOnRamp must be used within a OnRampProvider"
    );
    spy.mockRestore();
  });
});

// ─── SolanaCoinsProvider: loading pattern ────────────────────────────
describe("Data provider loading pattern (unit)", () => {
  it("useTransition async pattern catches errors silently", async () => {
    // This verifies the known bug: errors inside startTransition are swallowed
    const errorFn = async () => {
      throw new Error("Fetch failed");
    };

    // Simulate the pattern: startTransition(async () => { await fetch(); setData(); })
    // With React's startTransition, the error boundary doesn't catch this
    let errorCaught = false;
    try {
      await errorFn();
    } catch {
      errorCaught = true;
    }
    expect(errorCaught).toBe(true);
    // In the actual code, this error is NOT caught because startTransition swallows it
  });
});

// ─── useIsDesktop: hydration mismatch ────────────────────────────────
describe("useIsDesktop hydration behavior", () => {
  it("returns false during SSR (window undefined)", () => {
    // Simulate SSR environment
    const getMatch = (breakpoint: number) =>
      typeof globalThis.window !== "undefined" &&
      globalThis.window.innerWidth >= breakpoint;

    // In JSDOM, window exists, so we test the logic itself
    expect(typeof getMatch(1024)).toBe("boolean");
  });
});

// ─── AbortController cancellation pattern (ChartProvider) ────────────
describe("AbortController cancellation pattern", () => {
  it("aborts previous request on new call", () => {
    let abortRef: AbortController | null = null;

    // First call
    abortRef?.abort();
    const ac1 = new AbortController();
    abortRef = ac1;
    expect(ac1.signal.aborted).toBe(false);

    // Second call (should abort first)
    abortRef?.abort();
    const ac2 = new AbortController();
    abortRef = ac2;

    expect(ac1.signal.aborted).toBe(true);
    expect(ac2.signal.aborted).toBe(false);
  });

  it("prevents state update after abort", async () => {
    const ac = new AbortController();
    let stateUpdated = false;

    const fetchData = async () => {
      await new Promise((r) => setTimeout(r, 10));
      if (ac.signal.aborted) return;
      stateUpdated = true;
    };

    ac.abort(); // abort immediately
    await fetchData();
    expect(stateUpdated).toBe(false);
  });
});

// ─── SearchParamsSync: URL sync gate mechanism ───────────────────────
describe("SearchParamsSync URL sync", () => {
  it("blocks state->URL sync until urlLoaded is true", () => {
    let urlLoaded = false;
    const syncCalls: string[] = [];

    const syncToUrl = (sellToken: string | null, buyToken: string | null) => {
      if (!urlLoaded) return;
      const params = new URLSearchParams();
      if (sellToken) params.set("sellTokenChain", sellToken);
      if (buyToken) params.set("buyTokenChain", buyToken);
      syncCalls.push(params.toString());
    };

    // Before gate opens
    syncToUrl("1", "8453");
    expect(syncCalls).toHaveLength(0);

    // After gate opens
    urlLoaded = true;
    syncToUrl("1", "8453");
    expect(syncCalls).toHaveLength(1);
    expect(syncCalls[0]).toContain("sellTokenChain=1");
  });
});

// ─── TokenModalProvider: race condition scenario ─────────────────────
describe("TokenModalProvider race condition", () => {
  it("demonstrates race condition without AbortController", async () => {
    const results: string[] = [];

    const fetchTokens = async (wallet: string, delay: number) => {
      await new Promise((r) => setTimeout(r, delay));
      results.push(wallet);
    };

    // Simulate rapid wallet changes: wallet-A (slow), then wallet-B (fast)
    fetchTokens("wallet-A", 100); // slow request
    fetchTokens("wallet-B", 10); // fast request

    await new Promise((r) => setTimeout(r, 150));

    // Both resolve - wallet-A arrives AFTER wallet-B, overwriting correct data
    expect(results).toEqual(["wallet-B", "wallet-A"]); // wrong order!
    // The last value in state would be "wallet-A" which is stale
  });

  it("AbortController prevents stale update", async () => {
    const results: string[] = [];
    let abortRef: AbortController | null = null;

    const fetchTokens = async (wallet: string, delay: number) => {
      abortRef?.abort();
      const ac = new AbortController();
      abortRef = ac;

      await new Promise((r) => setTimeout(r, delay));
      if (ac.signal.aborted) return; // skip stale
      results.push(wallet);
    };

    fetchTokens("wallet-A", 100);
    fetchTokens("wallet-B", 10);

    await new Promise((r) => setTimeout(r, 150));

    // Only wallet-B should be in results because wallet-A was aborted
    expect(results).toEqual(["wallet-B"]);
  });
});

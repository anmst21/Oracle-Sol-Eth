import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { splitCompact } from "@/helpers/compact-formatter";
import { formatPriceValue } from "@/helpers/format-price-value";
import { truncateAddress } from "@/helpers/truncate-address";
import { applyDecimals } from "@/helpers/apply-decimals";
import { timeAgoShort } from "@/helpers/time-ago-short";

// ─── splitCompact ────────────────────────────────────────────────────
describe("splitCompact", () => {
  it("formats billions correctly", () => {
    const [num, unit] = splitCompact(63_653_654_843);
    expect(unit).toBe("b");
    expect(parseFloat(num)).toBeGreaterThan(60);
  });

  it("formats millions correctly", () => {
    const [num, unit] = splitCompact(1_500_000);
    expect(unit).toBe("m");
    expect(parseFloat(num)).toBeCloseTo(1.5, 0);
  });

  it("formats thousands correctly", () => {
    const [num, unit] = splitCompact(42_000);
    expect(unit).toBe("k");
    expect(parseFloat(num)).toBe(42);
  });

  it("returns empty unit for small numbers", () => {
    const [num, unit] = splitCompact(42);
    expect(unit).toBe("");
    expect(num).toBe("42");
  });

  it("handles zero", () => {
    const [num, unit] = splitCompact(0);
    expect(num).toBe("0");
    expect(unit).toBe("");
  });

  it("handles negative numbers", () => {
    const [num] = splitCompact(-1_000_000);
    expect(parseFloat(num.replace(/,/g, ""))).toBeLessThan(0);
  });
});

// ─── formatPriceValue ────────────────────────────────────────────────
describe("formatPriceValue", () => {
  it("formats large values with 2 decimal places", () => {
    expect(formatPriceValue(1234.56)).toBe("1,234.56");
  });

  it("formats small values with up to 6 decimal places", () => {
    const result = formatPriceValue(0.001234);
    expect(result).toContain("0.001234");
  });

  it("strips trailing zeros for small values", () => {
    const result = formatPriceValue(0.1);
    expect(result).toBe("0.1");
  });

  it("returns $– for NaN input", () => {
    expect(formatPriceValue("abc")).toBe("$–");
    expect(formatPriceValue(NaN)).toBe("$–");
  });

  it("handles string input with currency symbols", () => {
    expect(formatPriceValue("$1,234.56")).toBe("1,234.56");
  });

  it("handles zero", () => {
    expect(formatPriceValue(0)).toBe("0.00");
  });

  it("handles negative values", () => {
    const result = formatPriceValue(-5.5);
    expect(result).toContain("-5.50");
  });
});

// ─── truncateAddress ─────────────────────────────────────────────────
describe("truncateAddress", () => {
  it("truncates a long address", () => {
    const addr = "0x1234567890abcdef1234567890abcdef12345678";
    expect(truncateAddress(addr)).toBe("0x12...5678");
  });

  it("does not truncate addresses at boundary length", () => {
    // "0x123456" is 8 chars, head=4 + tail=4 = 8, so it's not truncated
    expect(truncateAddress("0x123456")).toBe("0x123456");
    expect(truncateAddress("abcdefgh")).toBe("abcdefgh");
  });

  it("truncates addresses just over boundary", () => {
    // 9 chars: head 4 + tail 4 = 8, shorter than 9, so it truncates
    expect(truncateAddress("abcdefghi")).toBe("abcd...fghi");
  });

  it("returns original if shorter than head+tail", () => {
    expect(truncateAddress("abcd")).toBe("abcd");
    expect(truncateAddress("abc")).toBe("abc");
  });

  it("supports custom head/tail/separator", () => {
    const addr = "0x1234567890abcdef";
    expect(truncateAddress(addr, 6, 6, "…")).toBe("0x1234…abcdef");
  });
});

// ─── applyDecimals ───────────────────────────────────────────────────
describe("applyDecimals", () => {
  it("applies 18 decimals (ETH-style)", () => {
    expect(applyDecimals("1000000000000000000", 18)).toBe("1");
  });

  it("applies 6 decimals (USDC-style)", () => {
    expect(applyDecimals("1000000", 6)).toBe("1");
  });

  it("handles fractional amounts", () => {
    expect(applyDecimals("1500000", 6)).toBe("1.5");
  });

  it("handles small amounts", () => {
    expect(applyDecimals("1", 6)).toBe("0.000001");
  });

  it("handles negative amounts", () => {
    expect(applyDecimals("-1000000", 6)).toBe("-1");
  });

  it("strips trailing zeros in fraction", () => {
    expect(applyDecimals("1100000", 6)).toBe("1.1");
  });

  it("handles zero", () => {
    expect(applyDecimals("0", 6)).toBe("0");
  });
});

// ─── timeAgoShort ────────────────────────────────────────────────────
describe("timeAgoShort", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns seconds for very recent", () => {
    const result = timeAgoShort("2025-01-15T11:59:30Z");
    expect(result).toBe("30s");
  });

  it("returns minutes", () => {
    const result = timeAgoShort("2025-01-15T11:55:00Z");
    expect(result).toBe("5min");
  });

  it("returns hours", () => {
    const result = timeAgoShort("2025-01-15T09:00:00Z");
    expect(result).toBe("3h");
  });

  it("returns days", () => {
    const result = timeAgoShort("2025-01-13T12:00:00Z");
    expect(result).toBe("2d");
  });

  it("returns weeks", () => {
    const result = timeAgoShort("2025-01-01T12:00:00Z");
    expect(result).toBe("2w");
  });

  it("returns months", () => {
    const result = timeAgoShort("2024-11-15T12:00:00Z");
    expect(result).toBe("2M");
  });

  it("returns years", () => {
    const result = timeAgoShort("2023-01-15T12:00:00Z");
    expect(result).toBe("2y");
  });

  it("returns 0s for same time", () => {
    const result = timeAgoShort("2025-01-15T12:00:00Z");
    expect(result).toBe("0s");
  });
});

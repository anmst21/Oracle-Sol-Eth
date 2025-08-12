export function formatPriceValue(raw: number | string): string {
  // 1) Parse raw input
  const n =
    typeof raw === "string" ? parseFloat(raw.replace(/[^0-9.-]+/g, "")) : raw;
  if (isNaN(n)) return "$–";

  const abs = Math.abs(n);
  // 2) Decide fraction range
  const [minFrac, maxFrac] = abs < 1 ? [2, 6] : [2, 2];

  // 3) Use toLocaleString for rounding/formatting
  let s = n.toLocaleString("en-US", {
    minimumFractionDigits: minFrac,
    maximumFractionDigits: maxFrac,
  });

  // 4) If <1, strip any trailing zeros beyond the last significant digit
  if (abs < 1) {
    s = s.replace(/(\.\d*?[1-9])0+$/, "$1");
  }

  return `${s}`;
}

const compactFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

/**
 * Format a number compactly and split into [value, unit].
 *
 * @param value  The raw number to format, e.g. 63653654843
 * @returns      [ "63.7", "b" ]
 */
export function splitCompact(value: number): [string, string] {
  // apply compact formatting
  const formatted = compactFormatter.format(value); // e.g. "63.7B"

  // extract the numeric part and the unit letter(s)
  const match = formatted.match(/^([\d.,]+)\s*([A-Za-z]+)$/);
  if (!match) {
    // fallback: no unit
    return [formatted, ""];
  }

  const [, numberPart, unitPart] = match;
  return [numberPart, unitPart.toLowerCase()];
}

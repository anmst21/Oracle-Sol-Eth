export function formatAmount(raw: string | undefined): string {
  const num = parseFloat(raw || "0");
  if (num >= 1) return num.toFixed(2);
  if (num === 0) return "0.0";
  const match = raw?.match(/^0\.0*/);
  const leadingZeros = match ? match[0].length - 2 : 0;
  return num.toFixed(Math.max(6, leadingZeros + 1));
}

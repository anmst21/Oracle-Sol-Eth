export function applyDecimals(amount: string, decimals: number): string {
  const negative = amount.startsWith("-");
  let a = negative ? amount.slice(1) : amount;

  // ensure the string is long enough to split
  a = a.padStart(decimals + 1, "0");

  const intPart = a.slice(0, a.length - decimals);
  let fracPart = a.slice(a.length - decimals);

  // trim trailing zeros in the fractional part
  fracPart = fracPart.replace(/0+$/, "");

  const formatted = fracPart.length > 0 ? `${intPart}.${fracPart}` : intPart;

  return negative ? `-${formatted}` : formatted;
}

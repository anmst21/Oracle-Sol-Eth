export function formatPairName(name: string): string {
  const withoutFee = name.replace(/\s*\d+(\.\d+)?%\s*$/, "");
  return withoutFee.trim().replace(/\s*\/\s*/, "/");
}

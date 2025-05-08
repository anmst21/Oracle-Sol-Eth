export function truncateAddress(
  str: string,
  headLength = 4,
  tailLength = 4,
  separator = "..."
): string {
  if (str.length <= headLength + tailLength) {
    return str;
  }
  const head = str.slice(0, headLength);
  const tail = str.slice(str.length - tailLength);
  return `${head}${separator}${tail}`;
}

export function formatBlogDate(isoString: Date) {
  const date = new Date(isoString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

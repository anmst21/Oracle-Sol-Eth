export function timeAgoShort(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const seconds = Math.floor((now - then) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: "y", seconds: 31536000 }, // 365 days
    { label: "M", seconds: 2592000 }, // 30 days
    { label: "w", seconds: 604800 }, // 7 days
    { label: "d", seconds: 86400 }, // 1 day
    { label: "h", seconds: 3600 }, // 1 hour
    { label: "min", seconds: 60 }, // 1 minute
    { label: "s", seconds: 1 }, // 1 second
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count}${interval.label}`;
    }
  }

  return "0s";
}

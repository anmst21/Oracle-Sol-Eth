export function timeAgoLong(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const seconds = Math.floor((now - then) / 1000);

  const intervals: { label: string; seconds: number }[] = [
    { label: "years ago", seconds: 31536000 }, // 365 days
    { label: "months ago", seconds: 2592000 }, // 30 days
    { label: "weeks ago", seconds: 604800 }, // 7 days
    { label: "days ago", seconds: 86400 }, // 1 day
    { label: "hours ago", seconds: 3600 }, // 1 hour
    { label: "minutes ago", seconds: 60 }, // 1 minute
    { label: "seconds ago", seconds: 1 }, // 1 second
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}`;
    }
  }

  return "0s";
}

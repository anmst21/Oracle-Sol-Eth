/**
 * Convert an ISO timestamp into [time24h, period, day, monthName].
 * @param isoString – e.g. "2025-07-19T19:10:10Z"
 * @returns [ "15:10:10", "PM", "19", "July" ]
 */
export function parseTimestampToArray(
  isoString: string
): [string, string, string, string] {
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, "0");

  // local hours/minutes/seconds
  const hh = date.getHours();
  const mm = date.getMinutes();
  const ss = date.getSeconds();
  const time24 = `${pad(hh)}:${pad(mm)}:${pad(ss)}`;

  const period = hh >= 12 ? "PM" : "AM";
  const day = date.getDate().toString();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];

  return [time24, period, day, month];
}

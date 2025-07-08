export function parseDateHistory(
  ts?: string
): [string, string, string, "AM" | "PM"] {
  // if no timestamp given, return empties + AM
  if (!ts) {
    return ["", "", "", "AM"];
  }

  const d = new Date(ts);

  // 1) day of month
  const day = d.getDate().toString();

  // 2) “Mon YYYY”
  const month = d.toLocaleString("default", { month: "short" });
  const year = d.getFullYear().toString();
  const monthYear = `${month} ${year}`;

  // 3) hh:mm:ss in 12-hour clock
  let hrs = d.getHours();
  const ampm: "AM" | "PM" = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12 === 0 ? 12 : hrs % 12;
  const hh = hrs.toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  const time = `${hh}:${mm}:${ss}`;

  return [day, monthYear, time, ampm];
}

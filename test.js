import fs from "fs";
import path from "path";

// 1. Load your JSON data
const filePath = path.resolve("./public/relay-daily-volume.json");
const raw = fs.readFileSync(filePath, "utf8");
const data = JSON.parse(raw);

// 2. Get max combined value per day
function getMaxDailyTotal(entries) {
    let maxDaily = 0;

    for (const entry of entries) {
        const chains = entry.chains || {};
        const dailyTotal = Object.values(chains).reduce(
            (sum, v) => sum + Number(v || 0),
            0
        );
        if (dailyTotal > maxDaily) maxDaily = dailyTotal;
    }

    return maxDaily;
}

// 3. “Nice” step helper (1, 2, 2.5, 5 × 10^n style)
function niceStep(rawStep) {
    if (rawStep <= 0) return 1;

    const exponent = Math.floor(Math.log10(rawStep));
    const fraction = rawStep / Math.pow(10, exponent);

    let niceFraction;
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 2.5) niceFraction = 2.5;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;

    return niceFraction * Math.pow(10, exponent);
}

// 4. Build 18 ticks with 2-cell margin above max
function buildYAxisTicks(maxDaily, tickCount = 18) {
    // We want: topTick = step * (tickCount - 1)
    // and: topTick >= maxDaily + 2 * step
    // => step >= maxDaily / (tickCount - 3)
    const minStep = maxDaily / (tickCount - 3);
    const step = niceStep(minStep);
    const topTick = step * (tickCount - 1);

    const ticks = Array.from({ length: tickCount }, (_, i) => step * i);

    return { step, topTick, ticks };
}

const maxDaily = getMaxDailyTotal(data);
const { step, topTick, ticks } = buildYAxisTicks(maxDaily, 18);

console.log("Max daily total:", maxDaily);
console.log("Step:", step);
console.log("Top tick:", topTick);
console.log("Ticks:", ticks);

// Optional: pretty print in “M” units for checking:
console.log(
    "Ticks (M):",
    ticks.map((v) => `${(v / 1_000_000).toFixed(1)}M`)
);
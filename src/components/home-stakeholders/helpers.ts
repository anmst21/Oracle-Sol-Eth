import { StakeholderType } from "./types";

export const sectionColors: Record<StakeholderType, string> = {
  featured: "#afe900",
  swap: "#00B0EB",
  coins: "#00EBB0",
  social: "#FFFFFF",
  creator: "#EB00B0",
  data: "#EB8900",
  protocol: "#EB003B",
};

export const ROTATIONS = [
  347.3, 314.95, 296, 275.65, 237.2, 217.95, 199.1, 166.8, 141.387, 115.718,
  90.278, 57.945, 38.5, 19.6,
] as const;

export const ITEMS_COUNT = ROTATIONS.length;

export const smoothAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: "easeInOut" },
} as const;

export const textAnimation = {
  initial: { opacity: 0, x: 10 },
  animate: {
    opacity: 1,
    x: 0,
  },
  transition: { duration: 0.2, ease: "easeInOut" },
  exit: {
    opacity: 0,
    x: 10,
  },
} as const;

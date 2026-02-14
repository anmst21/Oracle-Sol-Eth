export const TRANSITION = { duration: 0.2, ease: "easeOut" as const };

export const slidingTextAnimation = {
  initial: { x: 10, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -10, opacity: 0 },
  transition: TRANSITION,
};

export const modalAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: TRANSITION,
} as const;

export const iconProps = {
  initial: { opacity: 0, scale: 0.5 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0 },
  transition: TRANSITION,
};

export const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: TRANSITION,
};

export const buttonSlideAnimation = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
  transition: TRANSITION,
  style: { display: "flex", gap: 10 },
} as const;

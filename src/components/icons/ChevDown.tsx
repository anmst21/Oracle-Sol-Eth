import * as React from "react";
import { motion } from "motion/react";
const ChevDown = ({ isOpen }: { isOpen: boolean }) => {
  const variants = {
    closed: { rotate: 180 },
    open: { rotate: 360 },
  };
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      style={{ originX: 0.5, originY: 0.5 }} // center the rotation
      variants={variants}
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m5.334 9.333 2.195-2.195c.26-.26.683-.26.943 0l2.195 2.195"
      ></path>
    </motion.svg>
  );
};

export default ChevDown;

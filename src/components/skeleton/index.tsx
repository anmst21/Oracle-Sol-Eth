"use client";

import React, { useEffect, useState, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  isLoading?: boolean;
  width?: number | string;
  height?: number | string;
  radius?: number;
  flex?: boolean;
  children?: React.ReactNode;
  enableLayout?: boolean;
};

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function SkeletonLoaderWrapper({
  isLoading,
  width,
  height,
  radius = 2,
  flex,
  children,
  enableLayout,
}: Props) {
  const [showLoader, setShowLoader] = useState(isLoading);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (isLoading) {
      setShowLoader(true);
    } else {
      t = setTimeout(() => setShowLoader(false), 500);
    }
    return () => clearTimeout(t);
  }, [isLoading]);

  const style: CSSProperties = {
    // undefined → CSS auto, which Framer will measure
    width: showLoader ? width : undefined,
    height,
    flex: flex ? 1 : undefined,
    borderRadius: radius,
  };

  return (
    <motion.div
      className="wrapper"
      style={style}
      layout={enableLayout || false}
      transition={{ type: "tween", duration: 0.2 }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {showLoader ? (
          <motion.div
            key="skeleton"
            className="skeleton"
            variants={fade}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          />
        ) : (
          <motion.div
            className="to-gap"
            style={{ display: "flex" }}
            key="content"
            layout={enableLayout || false}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

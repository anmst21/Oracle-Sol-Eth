import React, { CSSProperties, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SkeletonLoaderWrapperProps = {
  /** Wraps any component and overlays a skeleton while loading */
  isLoading: boolean;
  /** Optional explicit width and height for wrapper */
  width?: string | number;
  height?: string | number;
  radius?: number;
  children: React.ReactNode;
};

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const SkeletonLoaderWrapper: React.FC<SkeletonLoaderWrapperProps> = ({
  isLoading,
  width,
  height,
  children,
  radius = 2,
}) => {
  const [showLoader, setShowLoader] = useState(isLoading);

  const style: CSSProperties = {};
  if (width !== undefined) style.width = showLoader ? width : "auto";
  if (height !== undefined) style.height = height;
  style.borderRadius = radius;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isLoading) {
      // show immediately
      setShowLoader(true);
    } else {
      // delay removal by 500ms
      timeout = setTimeout(() => setShowLoader(false), 500);
    }
    return () => clearTimeout(timeout);
  }, [isLoading]);

  return (
    <div className="wrapper" style={style}>
      <AnimatePresence>
        {showLoader ? (
          <motion.div
            className="skeleton"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          />
        ) : (
          children
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkeletonLoaderWrapper;

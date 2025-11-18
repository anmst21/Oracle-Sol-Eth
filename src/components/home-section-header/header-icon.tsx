"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { useInView } from "motion/react";

type Props = {
  icon?: React.ReactNode;
  animation: unknown;
};

const HeaderIcon = ({ animation }: Props) => {
  const containerRef = useRef<HTMLButtonElement | null>(null);

  // ✅ Correct type for lottieRef
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  const inView = useInView(containerRef, { margin: "-20%   0px" });

  // Separate play function
  const playAnimation = useCallback(() => {
    if (!lottieRef.current) return;

    // reset & play
    lottieRef.current.stop();
    lottieRef.current.play();
  }, []);

  useEffect(() => {
    if (inView) {
      playAnimation();
    }
  }, [inView, playAnimation]);

  return (
    <button
      onClick={playAnimation}
      ref={containerRef}
      className="home-page-header__title__icon"
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animation}
        loop={false}
        autoplay={false}
        style={{
          width: 26,
          height: 26,
        }}
      />
    </button>
  );
};

export default HeaderIcon;

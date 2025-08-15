"use client";

import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "@/animations/logo-animation.json";
// import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const HeaderLogo: React.FC = () => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  console.log("isAnimating", isAnimating);
  const handlePlay = () => {
    if (lottieRef.current) {
      setIsAnimating(true);
      lottieRef.current.goToAndPlay(0, true);
    }
  };

  const handleComplete = () => {
    setIsAnimating(false);
  };

  const pathname = usePathname();

  useEffect(() => {
    handlePlay();
  }, [pathname]);

  return (
    <Link
      href={"/"}
      className="header__logo"
      style={{ cursor: "pointer", width: 52, height: 22 }}
      onClick={handlePlay}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={false}
        autoplay={false}
        style={{ width: 52, height: 22 }}
        onComplete={handleComplete}
      />
      {/* {isAnimating ? (
     
      ) : (
        <Image
          onClick={handlePlay}
          src={"/oracle-logo.svg"}
          width={52}
          height={22}
          alt="Oracle Logo"
        />
      )} */}
    </Link>
  );
};

export default HeaderLogo;

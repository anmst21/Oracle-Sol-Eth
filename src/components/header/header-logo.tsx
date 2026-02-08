"use client";

import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import animationData from "@/animations/logo-animation.json";
// import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCategory } from "@/hooks/useCategory";
// import Link from "next/link";

const HeaderLogo = ({ isRedirect }: { isRedirect?: boolean }) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [, setIsAnimating] = useState(false);
  const { activeCategory } = useCategory();

  const handlePlay = () => {
    if (lottieRef.current) {
      setIsAnimating(true);
      lottieRef.current.goToAndPlay(0, true);
    }
  };

  const handleComplete = () => {
    setIsAnimating(false);
  };
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    handlePlay();
  }, [pathname, activeCategory]);

  return (
    <button
      // href={"/"}
      className="header__logo"
      style={{ cursor: "pointer", width: 52, height: 22 }}
      onClick={() => {
        handlePlay();
        if (isRedirect) push("/");
      }}
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
    </button>
  );
};

export default HeaderLogo;

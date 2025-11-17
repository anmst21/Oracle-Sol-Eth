"use client";

import React, { useEffect, useRef, useState } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import menuAnimationData from "@/animations/menu-logo-animation.json";
// import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCategory } from "@/hooks/useCategory";
// import Link from "next/link";

const MenuLogo = ({ isRedirect }: { isRedirect?: boolean }) => {
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { activeCategory } = useCategory();

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
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    handlePlay();
  }, [pathname, activeCategory]);

  return (
    <button
      // href={"/"}
      className="menu-bar__logo"
      //   style={{ cursor: "pointer", width: 106, height: 10 }}
      onClick={() => {
        handlePlay();
        if (isRedirect) push("/");
      }}
    >
      {/* <MenuLogoDefault /> */}

      <Lottie
        lottieRef={lottieRef}
        animationData={menuAnimationData}
        loop={false}
        autoplay={false}
        style={{ width: 106, height: 10 }}
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

export default MenuLogo;

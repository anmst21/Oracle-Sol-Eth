import { useEffect, useState } from "react";

export function useIsDesktop(breakpoint = 1024) {
  const getMatch = () =>
    typeof window !== "undefined" && window.innerWidth >= breakpoint;

  const [isDesktop, setIsDesktop] = useState(getMatch);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(getMatch());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return isDesktop;
}

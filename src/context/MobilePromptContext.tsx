"use client";

import { createContext, useContext, useEffect, useState } from "react";

type MobilePromptContextType = {
  pwaPromptActive: boolean;
  isReady: boolean;
  setPwaPromptDone: () => void;
};

const MobilePromptContext = createContext<MobilePromptContextType>({
  pwaPromptActive: false,
  isReady: false,
  setPwaPromptDone: () => {},
});

export const useMobilePrompt = () => useContext(MobilePromptContext);

export const MobilePromptProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pwaPromptActive, setPwaPromptActive] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in window.navigator &&
        (window.navigator as Navigator & { standalone: boolean }).standalone);
    const seen = localStorage.getItem("pwaBannerSeen");

    if (isMobile && !isStandalone && !seen) {
      setPwaPromptActive(true);
    }
    setIsReady(true);
  }, []);

  const setPwaPromptDone = () => {
    setPwaPromptActive(false);
  };

  return (
    <MobilePromptContext.Provider
      value={{ pwaPromptActive, isReady, setPwaPromptDone }}
    >
      {children}
    </MobilePromptContext.Provider>
  );
};

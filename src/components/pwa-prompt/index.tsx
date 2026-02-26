"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMobilePrompt } from "@/context/MobilePromptContext";
import { PwaBulb, PwaShare, PwaAdd, InputCross } from "../icons";

const PwaPrompt = () => {
  const { pwaPromptActive, setPwaPromptDone } = useMobilePrompt();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeModal = useCallback(() => {
    localStorage.setItem("pwaBannerSeen", "true");
    setPwaPromptDone();
  }, [setPwaPromptDone]);

  useEffect(() => {
    if (!pwaPromptActive) return;
    timerRef.current = setTimeout(closeModal, 10000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pwaPromptActive, closeModal]);

  return (
    <AnimatePresence mode="wait">
      {pwaPromptActive && (
        <>
          <div onClick={closeModal} className="consent-overlay" />
          <motion.div
            initial={{ x: 600 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ x: 600 }}
            className="pwa-prompt__container"
          >
            <div className="pwa-prompt">
              <div className="pwa-prompt__status">
                <div className="pwa-prompt__status__bar">
                  <motion.div
                    className="status-line status-line__white"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, ease: "linear" }}
                  />
                  <div className="status-line status-line__grey" />
                </div>
                <button
                  onClick={closeModal}
                  className="pwa-prompt__status__close"
                >
                  <InputCross />
                </button>
              </div>

              <div className="pwa-prompt__header">
                <div className="pwa-prompt__header__tag">Tip</div>
                <div className="pwa-prompt__header__value">
                  <PwaBulb />
                  <h4>Install Oracle App</h4>
                </div>
              </div>

              <div className="pwa-prompt__warning">
                <span>
                  Tap the{" "}
                  <span className="pwa-prompt__inline-icon">
                    <PwaShare />
                  </span>{" "}
                  Share button, then select{" "}
                  <span className="pwa-prompt__inline-icon">
                    <PwaAdd />
                  </span>{" "}
                  Add to Home Screen to install Oracle as an app.
                </span>
              </div>

              <div className="pwa-prompt__buttons">
                <button onClick={closeModal} className="pwa-prompt__btn-deny">
                  Deny
                </button>
                <button onClick={closeModal} className="pwa-prompt__btn-ok">
                  Ok
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PwaPrompt;

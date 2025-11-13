"use client";

import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import ConsentBtn from "./consent-btn";
import { motion, AnimatePresence } from "framer-motion";
import { NavigationPrivacy, InputCross } from "../icons";

const CookieConsentBanner = () => {
  const cookieValue = getCookieConsentValue("cookieConsentOracle");
  const [showModal, setShowModal] = useState(!cookieValue ? true : false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);
  return (
    <>
      <AnimatePresence mode="wait">
        {isLoaded && showModal && (
          <>
            <div onClick={closeModal} className="consent-overlay" />
            <motion.div
              initial={{ x: 600 }} // Start 300px to the right
              animate={{ x: 0 }} // Animate to its natural position
              transition={{ duration: 0.3 }}
              exit={{ x: 600 }}
              className="cookie-consent__container"
            >
              <CookieConsent
                onOverlayClick={closeModal}
                cookieName="cookieConsentOracle"
                onAccept={() => setShowModal(false)}
                onDecline={() => setShowModal(false)}
                buttonClasses="accept-cookie"
                declineButtonClasses="decline-cookie"
                location="bottom"
                buttonText="Accept All"
                disableStyles
                ButtonComponent={(
                  props: React.FC<React.ComponentProps<typeof ConsentBtn>>
                ) => <ConsentBtn callback={closeModal} {...props} />}
                buttonWrapperClasses="consent-btn-wrapper"
                containerClasses="cookie-consent"
                contentClasses="consent-text"
                declineButtonText="Decline"
                enableDeclineButton
                expires={365}
              >
                <div className="cookie-consent__status">
                  <div className="cookie-consent__status__bar">
                    <motion.div
                      className="status-line status-line__white"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 10, ease: "linear" }} // 5 seconds
                      onAnimationComplete={closeModal} // auto-close when bar fills
                    />
                    <div className="status-line status-line__grey" />
                  </div>
                  <button
                    onClick={closeModal}
                    className="cookie-consent__status__close"
                  >
                    <InputCross />
                  </button>
                </div>
                <div className="cookie-consent__header">
                  <div className="cookie-consent__header__tag">Cookies</div>
                  <div className="cookie-consent__header__value">
                    <NavigationPrivacy />
                    <h4>We Value Your Privacy!</h4>
                  </div>
                </div>

                <div className="cookie-consent__warning">
                  <span>
                    Our website uses cookies and similar technologies to
                    personalize content and analyze traffic. Please review our{" "}
                    <Link href="/privacy">Privacy Policy</Link> to learn more
                    about the data we collect, or close this message to
                    continue.
                  </span>
                </div>
              </CookieConsent>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CookieConsentBanner;

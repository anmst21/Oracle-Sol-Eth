"use client";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export const CapchaProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPCHA_KEY as string}
      container={{
        //  element: "capcha-container", // ID of the custom element
        parameters: {
          badge: "bottomright", // or inline / bottomleft
          theme: "dark", // or dark
        },
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};

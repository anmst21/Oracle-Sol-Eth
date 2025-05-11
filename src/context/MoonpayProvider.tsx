"use client";

import dynamic from "next/dynamic";

const MoonPayProvider = dynamic(
  () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayProvider),
  { ssr: false }
);

const moonpayApiKey = process.env.NEXT_PUBLIC_MOONPAY_API_KEY;

export default function MoonPayContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MoonPayProvider apiKey={moonpayApiKey as string} debug>
      {children}
    </MoonPayProvider>
  );
}

import { Suspense } from "react";
import type { Metadata } from "next";
import {
  Fira_Code,
  Funnel_Display,
  Handjet,
  Funnel_Sans,
} from "next/font/google";
import PrivyProvider from "../context/PrivyProvider";
import "../styles/index.scss";
import { CommunityCoinsProvider } from "@/context/FarcasterCommunityTokensProvider";
import { SolanaCoinsProvider } from "@/context/DexScreenerTrendingSolataTokensProvider";
import { GeckoTokensProvider } from "@/context/GeckoTerminalCoinsProvider";
import MoonPayContextProvider from "@/context/MoonpayProvider";
import { TokenModalProvider } from "@/context/TokenModalProvider";
import { ActiveWalletProvider } from "@/context/ActiveWalletContext";
import { SlippageProvider } from "@/context/SlippageContext";
import Header from "@/components/header";
import { RelayKitProviderWrapper as RelayKitProvider } from "@/context/RelayKitProvider";
import QueryClientProvider from "@/context/QueryClientProvider";
// import HeaderFooter from "@/components/footer/header-footer";
import FaviconAnimator from "@/components/favicon-animatior";
import OnRampProvider from "@/context/OnRampProvider";
import FeedProvider from "@/context/FeedProvider";
import Footer from "@/components/footer";
import { getHeaderModal } from "../../sanity/sanity-utils";
import MenuBar from "@/components/menu";
import CookieConsentBanner from "@/components/cookie-consent";
import { CapchaProvider } from "@/context/CapchaProvier";
// import FarcasterAuthProvider from "@/context/FarcasterAuthProvider";
const firaCode = Fira_Code({
  subsets: ["latin"], // adjust as needed
  variable: "--font-fira-code",
});

// load Handjet as a CSS variable
const handjet = Handjet({
  subsets: ["latin"],
  variable: "--font-handjet",
});
const funnelDisplay = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
});
const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  variable: "--font-funnel-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oracleswap.app"),
  title: {
    default: "Oracle — Cross-Chain Trading Platform",
    template: "%s | Oracle",
  },
  description:
    "Swap, bridge, buy, and send crypto across Solana, Ethereum, Base, Arbitrum, and more. Instant Relay-powered fills with minimal gas fees.",
  keywords: [
    "crypto swap",
    "cross-chain bridge",
    "DeFi",
    "Solana",
    "Ethereum",
    "token trading",
    "Oracle",
    "Relay",
    "MoonPay",
    "on-ramp",
  ],
  authors: [{ name: "Oracle" }],
  creator: "Oracle",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oracleswap.app",
    siteName: "Oracle",
    title: "Oracle — Cross-Chain Trading Platform",
    description:
      "Swap, bridge, buy, and send crypto across Solana, Ethereum, Base, Arbitrum, and more. Instant Relay-powered fills with minimal gas fees.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Oracle — Cross-Chain Trading Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@0xN3XUS",
    creator: "@0xN3XUS",
    title: "Oracle — Cross-Chain Trading Platform",
    description:
      "Swap, bridge, buy, and send crypto across Solana, Ethereum, Base, Arbitrum, and more. Instant Relay-powered fills with minimal gas fees.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const community = await fetchCommunityCoins();
  // console.log("solana coins", solana);

  // const s = await searchDexTokens({ network: "base", query: "degen" });
  const { categories, blogposts } = await getHeaderModal();
  return (
    <html lang="en">
      <body
        className={`${firaCode.variable} ${handjet.variable} ${funnelDisplay.variable} ${funnelSans.variable}`}
      >
        <Suspense>
          <FaviconAnimator />
        </Suspense>
        <CapchaProvider>
          <QueryClientProvider>
            <PrivyProvider>
              <SolanaCoinsProvider>
                <CommunityCoinsProvider>
                  <GeckoTokensProvider>
                    <MoonPayContextProvider>
                      <ActiveWalletProvider>
                        <TokenModalProvider>
                          <RelayKitProvider>
                            <OnRampProvider>
                              <FeedProvider>
                                <SlippageProvider>
                                  <Header
                                    categories={categories}
                                    blogposts={blogposts}
                                  />
                                  <div className="main">{children}</div>
                                  <CookieConsentBanner />

                                  <MenuBar
                                    categories={categories}
                                    blogposts={blogposts}
                                  />
                                  <Footer />

                                  {/* <HeaderFooter /> */}
                                </SlippageProvider>
                              </FeedProvider>
                            </OnRampProvider>
                          </RelayKitProvider>
                        </TokenModalProvider>
                      </ActiveWalletProvider>
                    </MoonPayContextProvider>
                  </GeckoTokensProvider>
                </CommunityCoinsProvider>
              </SolanaCoinsProvider>
            </PrivyProvider>
          </QueryClientProvider>
        </CapchaProvider>
      </body>
    </html>
  );
}

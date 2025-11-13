import type { ReactNode } from "react";

import {
  CrossChain,
  DiscoveryContext,
  FiatOnRamp,
  MultiWallet,
  PolishedPerformance,
  PortableCharting,
  SocialFeed,
  TransparencySafety,
  UnifiedSurface,
} from "@/components/icons/home-blog";

export type HomeBlogPost = {
  title: string;
  leadLine: string;
  icon: ReactNode;
  href: string;
};

export const homeBlogPosts: HomeBlogPost[] = [
  {
    title: "Unified surface",
    leadLine:
      "Swap, bridge, and send from a single window - no tab hopping, no context switches.",
    icon: <UnifiedSurface />,
    href: "/unified-surface",
  },
  {
    title: "Multi-Wallet Control",
    leadLine:
      "Link multiple wallets and switch instantly. Your first connected wallet powers auth and requests; others are ready for execution.",
    icon: <MultiWallet />,
    href: "/multi-wallet-control",
  },
  {
    title: "Discovery & Context",
    leadLine:
      "Search pairs across chains, inspect FDV, liquidity, volume, and recent trades-then pre-fill routes with a click.",
    icon: <DiscoveryContext />,
    href: "/discovery-context",
  },
  {
    title: "Cross-Chain Routing",
    leadLine:
      "Orders are filled on the destination chain by relayers and settled cheaply after, giving you near-instant execution.",
    icon: <CrossChain />,
    href: "/cross-chain-routing",
  },
  {
    title: "Social Feed",
    leadLine:
      "We associate Farcaster identities with user's on-chain activity  — so you can see (and mirror) what your network is doing.",
    icon: <SocialFeed />,
    href: "/social-feed",
  },
  {
    title: "Transparency & Safety",
    leadLine:
      "Non-custodial flows, clear fee breakdowns, and explorer links on every action. MoonPay handles KYC/AML.",
    icon: <TransparencySafety />,
    href: "/transparency-safety",
  },
  {
    title: "Fiat On-Ramp",
    leadLine:
      "Buy with cards, bank, or mobile pay. If your target token can't be purchased directly, Oracle offers a follow-up swap.",
    icon: <FiatOnRamp />,
    href: "/fiat-on-ramp",
  },
  {
    title: "Portable Charting",
    leadLine:
      "Live OHLCV, quick timeframes, and pool stats in a focused view. When the setup looks right, route a swap straight from the chart. ",
    icon: <PortableCharting />,
    href: "/portable-charting",
  },
  {
    title: "Polished Performance",
    leadLine:
      "Snappy interactions, smooth  Framer Motion animations, sensible defaults, and saved preferences.",
    icon: <PolishedPerformance />,
    href: "/polished-performance",
  },
];

import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  NavigationEthereum,
  NavigationCommunity,
  NavigationFeatured,
  NavigationFollowing,
  NavigationSolana,
  FeedIconMobile,
  SwapIconMobile,
  CoinsIconMobile,
  PrivacyIconMobile,
  ContactsIconMobile,
  BlogIconMobile,
} from "@/components/icons";

import {
  HeaderFeed,
  NavigationContacts,
  NavigationBlog,
  NavigationPrivacy,
  ChartIcon,
  HistoryIcon,
  SwapIcon,
  SwapBuy,
} from "@/components/icons";
import DropdownRoutes from "@/components/header/dropdown-routes";
import DropdownBlog from "@/components/header/dropdown-blog";
import { usePathname } from "next/navigation";
import { Blogpost, Category } from "@/types/blogpost-types";

export function useRouteOptions({
  blogposts,
  categories,
}: {
  blogposts: Blogpost[];
  categories: Category[];
}) {
  const { ready, user } = usePrivy();
  const pathname = usePathname();

  const swapRouteOptions = [
    {
      name: "Swap",
      icon: <SwapIcon />,
      description: "Exchange tokens instantly across chains.",
      slug: "/swap",
      isVisible: true,
    },
    {
      name: "Buy",
      icon: <SwapBuy />,
      description: "Purchase crypto with card or bank in seconds.",
      slug: "/buy",
      isVisible: true,
    },
    {
      name: "Chart",
      icon: <ChartIcon />,
      description: "View live markets, liquidity, and price action.",
      slug: "/chart",
      isVisible: true,
    },
    {
      name: "History",
      icon: <HistoryIcon />,
      description: "Track past swaps, buys, and cross-chain activity.",
      slug: "/history",
      isVisible: ready && user !== null,
    },
  ];

  const feedRouteOptions = [
    {
      name: "Featured",
      icon: <NavigationFeatured />,
      description: "Top swaps and mints from across the network.",
      slug: "/feed/featured",
      isVisible: true,
    },
    {
      name: "Following",
      icon: <NavigationFollowing />,
      description: "Activity from the creators and wallets you follow.",
      slug: "/feed/following",

      isVisible: ready && user !== null && user?.farcaster !== undefined,
    },
  ];

  const coinsRouteOptions = [
    {
      name: "Community",
      icon: <NavigationCommunity />,
      description: "Explore trending community tokens and new launches.",
      slug: "/coins/community",
      isVisible: true,
    },
    {
      name: "Ethereum",
      icon: <NavigationEthereum />,
      description: "Track and trade top ERC-20 tokens on Ethereum.",
      slug: "/coins/ethereum",
      isVisible: true,
    },
    {
      name: "Solana",
      icon: <NavigationSolana />,
      description: "Follow fast-moving Solana coins and ecosystem trends.",
      slug: "/coins/solana",
      isVisible: true,
    },
  ];

  const navigationItemsMain = [
    {
      title: "Swap",
      slug: "/swap",
      iconMobile: <SwapIconMobile />,

      icon: <SwapIcon />,
      active:
        pathname.includes("/swap") ||
        pathname.includes("/buy") ||
        pathname.includes("/chart") ||
        pathname.includes("/history"),
      modal: <DropdownRoutes routes={swapRouteOptions} />,
    },
    {
      title: "Feed",
      slug: "/feed",

      iconMobile: <FeedIconMobile />,

      icon: <HeaderFeed />,
      active: pathname.includes("/feed") || pathname.includes("/user"),
      modal: <DropdownRoutes routes={feedRouteOptions} />,
    },
    {
      title: "Coins",
      slug: "/coins/community",
      icon: <SwapBuy />,
      iconMobile: <CoinsIconMobile />,

      active: pathname.includes("/coins"),
      modal: <DropdownRoutes routes={coinsRouteOptions} />,
    },
  ];
  const navigationItemsHome = [
    {
      title: "Blog",
      slug: "/blog",
      icon: <NavigationBlog />,
      iconMobile: <BlogIconMobile />,

      active: pathname.includes("/blog"),
      modal: <DropdownBlog categories={categories} blogposts={blogposts} />,
    },
    {
      title: "Contacts",
      slug: "/contacts",
      iconMobile: <ContactsIconMobile />,

      icon: <NavigationContacts />,
      active: pathname.includes("/contacts"),
      modal: null,
    },
    {
      title: "Privacy",
      slug: "/privacy",
      iconMobile: <PrivacyIconMobile />,

      icon: <NavigationPrivacy />,
      active: pathname.includes("/privacy"),
      modal: null,
    },
  ];

  return {
    swapRouteOptions,
    feedRouteOptions,
    coinsRouteOptions,
    navigationItemsMain,
    navigationItemsHome,
  };
}

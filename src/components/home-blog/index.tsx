"use client";

import React, { useCallback, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
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
import { LinkBlog, HomeSectionCross } from "../icons";
import HomeSectionHeader from "../home-section-header";
import { HomeHeaderType } from "@/types/home-page";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useAnimationControls } from "motion/react";

const homeBlogPosts = [
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

const ANIMATION_TIME = 3000;

function StatusItem({
  active,
  durationMs,
  playing,
  onClick,
  // bump changes whenever we need to hard-restart the fill animation
  bumpKey,
}: {
  active: boolean;
  durationMs: number;
  playing: boolean;
  onClick: () => void;
  bumpKey: number;
}) {
  const controls = useAnimationControls();

  // keep the bar snapped to 100% for completed items, 0% for upcoming ones
  useEffect(() => {
    if (!active) {
      controls.stop();
      controls.set({ scaleX: 0 }); // reset for non-active
    }
  }, [active, controls]);

  // (re)start / pause the active bar
  useEffect(() => {
    if (!active) return;

    // restart from 0 on each bump
    controls.set({ scaleX: 0 });

    if (playing) {
      controls.start({
        scaleX: 1,
        transition: { duration: durationMs / 1000, ease: "linear" },
      });
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, playing, durationMs, bumpKey]);

  return (
    <div className="home-blog__status__item" onClick={onClick}>
      <div className="animated-status">
        <motion.div
          className="animated-status__animated"
          style={{ transformOrigin: "left center" }}
          initial={{ scaleX: 0 }}
          animate={controls}
        />
      </div>
    </div>
  );
}

const HomeBlog = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false }, [
    Autoplay({ playOnInit: true, delay: ANIMATION_TIME }),
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    const autoplay = emblaApi?.plugins()?.autoplay;

    emblaApi.on("scroll", () => {
      autoplay.play();
    });

    emblaApi.on("select", () => {
      const lastIndex = emblaApi.slideNodes().length - 1;
      if (autoplay.isPlaying()) autoplay.stop();
      if (emblaApi.selectedScrollSnap() === lastIndex) {
        setTimeout(() => {
          emblaApi.scrollTo(0);
          autoplay.play();
        }, ANIMATION_TIME); // wait for delay before resetting
      }
    });
  }, [emblaApi]);

  const onButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );
  return (
    <div className="home-blog">
      <HomeSectionHeader type={HomeHeaderType.Blog} />

      <div className="home-blog__viewport" ref={emblaRef}>
        <div className="home-blog__container">
          {homeBlogPosts.map((post, i) => (
            <Link
              className={`home-blog-post home-blog-post--phone home-blog-post--${i + 1}`}
              href={`/blog${post.href}`}
              key={post.title}
            >
              <div className="home-blog-post__container">
                <div className="home-blog-post__index">{i + 1}</div>
                <div className="home-blog-post__cross">
                  <HomeSectionCross />
                </div>
                {i === homeBlogPosts.length - 1 && (
                  <>
                    <div className="home-blog-post__cross--top">
                      <HomeSectionCross />
                    </div>
                    <div className="home-blog-post__cross--bottom">
                      <HomeSectionCross />
                    </div>
                  </>
                )}
                <div className="home-blog-post__header">
                  <div className="home-blog-post__header__icon">
                    {post.icon}
                  </div>
                  <div className="home-blog-post__header__title">
                    {post.title}
                  </div>
                </div>
                <p className="home-blog-post__leadline">{post.leadLine}</p>
                <div className="home-blog-post__uri">
                  <LinkBlog />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="home-blog__status">
        {homeBlogPosts.map((_, i) => {
          return (
            <div
              onClick={() => onButtonClick(i)}
              className="home-blog__status__item"
              key={i}
            >
              <div className="animated-status">
                <div className="animated-status--animated" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="home-blog__section">
        {homeBlogPosts.map((post, i) => {
          return (
            <Link
              className={`home-blog-post home-blog-post--${i + 1}`}
              href={`/blog${post.href}`}
              key={post.title}
            >
              <div className="home-blog-post__header">
                <div className="home-blog-post__header__icon">{post.icon}</div>
                <div className="home-blog-post__header__title">
                  {post.title}
                </div>
              </div>
              <p className="home-blog-post__leadline">{post.leadLine}</p>
              <div className="home-blog-post__uri">
                <LinkBlog />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomeBlog;

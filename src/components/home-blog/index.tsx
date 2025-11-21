"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { LinkBlog, HomeSectionCross } from "../icons";
import HomeSectionHeader from "../home-section-header";
import { HomeHeaderType } from "@/types/home-page";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { homeBlogPosts } from "@/helpers/home-blog-posts";
const ANIMATION_TIME = 5000;

const HomeBlog = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: false,
      align: "center",
      containScroll: false,
    },
    [Autoplay({ playOnInit: true, delay: ANIMATION_TIME })]
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!emblaApi || isDesktop) return;

    let frameId: number;

    const loop = () => {
      const progress = emblaApi.scrollProgress(); // 0 → 1
      setScrollProgress(progress);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [emblaApi, isDesktop]);

  useEffect(() => {
    if (!emblaApi || isDesktop) return;

    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;

    const scheduleRestart = () => {
      autoplay.play();
    };

    emblaApi.on("pointerUp", scheduleRestart);

    return () => {
      emblaApi.off("pointerUp", scheduleRestart);
    };
  }, [emblaApi, isDesktop]);

  const onButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;

      const autoplay = emblaApi.plugins()?.autoplay;
      autoplay.reset();

      emblaApi.scrollTo(index);
      // autoplay.play();
    },
    [emblaApi]
  );

  const getSegmentProgress = (
    globalProgress: number,
    index: number,
    total: number
  ) => {
    if (total <= 0) return 0;

    const segmentSize = 1 / total;
    const start = index * segmentSize;
    // const end = start + segmentSize;

    // Map global [start, end] → local [0, 1]
    const raw = (globalProgress - start) / segmentSize;

    // Clamp to [0, 1]
    return Math.min(Math.max(raw, 0), 1);
  };
  return (
    <div id="features" className="home-blog">
      <HomeSectionHeader type={HomeHeaderType.Blog} />

      <div className="home-blog__viewport" ref={emblaRef}>
        <div ref={containerRef} className="home-blog__container">
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
          const segmentProgress = getSegmentProgress(
            scrollProgress,
            i - 1,
            homeBlogPosts.length - 1
          );

          return (
            <div
              onClick={() => onButtonClick(i)}
              className="home-blog__status__item"
              key={i}
            >
              <div className="animated-status">
                <div
                  style={{ width: `${segmentProgress * 100}%` }}
                  className="animated-status--animated"
                />
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

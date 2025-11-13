"use client";

import React, { useCallback, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";

import { LinkBlog, HomeSectionCross } from "../icons";
import HomeSectionHeader from "../home-section-header";
import { HomeHeaderType } from "@/types/home-page";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
// import { motion, useAnimationControls } from "motion/react";
import { homeBlogPosts } from "@/helpers/home-blog-posts";
const ANIMATION_TIME = 3000;

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

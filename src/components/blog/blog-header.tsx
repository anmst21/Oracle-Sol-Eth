"use client";

import { Category } from "@/types/blogpost-types";
import classNames from "classnames";
import { motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

type Props = {
  categories: Category[];
};

const BlogHeader = ({ categories }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onClick = (slug: string) => {
    const newPath = "/blog" + "?" + createQueryString("category", slug);
    router.push(newPath);
    router.refresh();
  };

  //   <button
  //     className={classNames({
  //       "slippage-modal__button--active": !isFollowing,
  //     })}
  //     onClick={() => onFeedChange(false)}
  //     key={"feed-featured"}
  //   >
  //     Featured
  //   </button>;

  return (
    <div className="blog-header">
      <div className="blog-mini-divider" />
      <button
        onClick={() => router.push("/blog")}
        className={classNames("blog-header__btn", {
          "blog-header__btn--active": !activeCategory,
        })}
      >
        Featured
        {!activeCategory && (
          <motion.div layoutId="underline" className="underline" />
        )}
      </button>
      {categories.map((category, i) => {
        return (
          <button
            onClick={() => onClick(category.slug)}
            key={i}
            className={classNames("blog-header__btn", {
              "blog-header__btn--active": activeCategory === category.slug,
            })}
          >
            {category.title}
            {activeCategory === category.slug && (
              <motion.div layoutId="underline" className="underline" />
            )}
          </button>
        );
      })}
      <div className="blog-divider" />
    </div>
  );
};

export default BlogHeader;

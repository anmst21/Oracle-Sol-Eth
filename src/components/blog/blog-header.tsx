"use client";

import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/blogpost-types";
import classNames from "classnames";
import { motion } from "motion/react";
import React from "react";
import { useRouter } from "next/navigation";

type Props = {
  categories: Category[];
};

const BlogHeader = ({ categories }: Props) => {
  const { activeCategory, setCategory } = useCategory();
  const { push } = useRouter();
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
        onClick={() => push("/blog")}
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
            onClick={() => setCategory(category.slug)}
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

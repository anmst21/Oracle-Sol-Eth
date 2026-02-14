"use client";

import { useCategory } from "@/hooks/useCategory";
import { Category } from "@/types/blogpost-types";
import classNames from "classnames";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Props = {
  categories: Category[];
};

const BlogHeader = ({ categories }: Props) => {
  const { activeCategory, setCategory } = useCategory();
  const { push } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  const activeKey = activeCategory || "featured";

  useEffect(() => {
    const node = btnRefs.current.get(activeKey);
    if (node && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = node.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      setUnderline({
        left: itemRect.left - containerRect.left + scrollLeft,
        width: itemRect.width,
      });
      setReady(true);
    }
  }, [activeKey]);

  return (
    <div className="blog-header">
      <div className="blog-mini-divider" />
      <div className="blog-header__wrapper" ref={containerRef}>
        <button
          ref={(el) => {
            if (el) btnRefs.current.set("featured", el);
          }}
          onClick={() => push("/blog")}
          className={classNames("blog-header__btn", {
            "blog-header__btn--active": !activeCategory,
          })}
        >
          Featured
        </button>
        {categories.map((category, i) => (
          <button
            ref={(el) => {
              if (el) btnRefs.current.set(category.slug, el);
            }}
            onClick={() => setCategory(category.slug)}
            key={i}
            className={classNames("blog-header__btn", {
              "blog-header__btn--active": activeCategory === category.slug,
            })}
          >
            {category.title}
          </button>
        ))}
        {ready && (
          <motion.div
            className="underline"
            animate={{ left: underline.left, width: underline.width }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            style={{ position: "absolute", bottom: 0 }}
          />
        )}
      </div>
      <div className="blog-divider" />
    </div>
  );
};

export default BlogHeader;

"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Blogpost, Category } from "@/types/blogpost-types";
import NavigationItem from "./navigation-item";
import { useRouteOptions } from "@/hooks/useRouteOptions";
import { usePathname } from "next/navigation";

const Navigation = ({
  isHomeRoute,
  categories,
  blogposts,
}: {
  blogposts: Blogpost[];
  categories: Category[];
  isHomeRoute: boolean;
}) => {
  const { navigationItemsMain, navigationItemsHome } = useRouteOptions({
    categories,
    blogposts,
  });

  const items = isHomeRoute ? navigationItemsHome : navigationItemsMain;
  const activeSlug = items.find((item) => item.active)?.slug || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const node = itemRefs.current.get(activeSlug);
    if (node && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = node.getBoundingClientRect();
      setUnderline({
        left: itemRect.left - containerRect.left + 21,
        width: itemRect.width - 25,
      });
      setReady(true);
    } else {
      setReady(false);
    }
  }, [activeSlug, pathname]);

  return (
    <div className="header-navigation" ref={containerRef}>
      {items.map((item) => (
        <NavigationItem
          key={item.slug}
          item={item}
          setRef={(node) => {
            if (node) itemRefs.current.set(item.slug, node);
          }}
        />
      ))}
      {ready && (
        <motion.div
          className="underline-header"
          animate={{ left: underline.left, width: underline.width }}
          transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
          style={{ position: "absolute", bottom: 0 }}
        />
      )}
    </div>
  );
};

export default Navigation;

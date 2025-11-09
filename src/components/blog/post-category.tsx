"use client";

import { useCategory } from "@/hooks/useCategory";
import React from "react";

type Props = {
  slug: string;
  title: string;
  r: number;
  g: number;
  b: number;
};

function PostCategory({ slug, title, r, g, b }: Props) {
  const { setCategory } = useCategory();

  return (
    <button
      style={{ background: `rgba(${r}, ${g}, ${b}, 0.1)` }}
      className="post-title__category"
      onClick={() => setCategory(slug)}
    >
      <span style={{ color: `rgba(${r}, ${g}, ${b}, 1)` }}>#{title}</span>
    </button>
  );
}

export default PostCategory;

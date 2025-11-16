import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Blogpost } from "@/types/blogpost-types";
import { LinkBlog } from "../icons";
import { parseDateHistory } from "@/helpers/parse-date-history";

type Props = {
  blogpost: Blogpost;
  index: number;
};

const BlogCard = ({ blogpost, index }: Props) => {
  const [date, monthYear] = parseDateHistory(blogpost._createdAt.toString());
  const [month, year] = monthYear.split(" ");

  const { r, g, b } = blogpost.category.textColor;
  return (
    <Link
      href={`/blog/${blogpost.slug}`}
      key={blogpost._id}
      className={`blog-post  blog-post--${index + 1}`}
    >
      <div className="blog-post__author__image">
        <Image
          alt="Author image"
          width={16}
          height={16}
          src={blogpost.author.image}
        />
      </div>
      <div className="blog-post__top">
        <div
          style={{ background: `rgba(${r}, ${g}, ${b}, 0.1)` }}
          className="blog-post__category"
        >
          <span style={{ color: `rgba(${r}, ${g}, ${b}, 1)` }}>
            #{blogpost.category.title}
          </span>
        </div>
        <div className="blog-post__author">{blogpost.author.name}</div>
        <div className="blog-post__created">
          <span>{date}</span>
          <span>{month}</span>
          <span>{year}</span>
        </div>
      </div>
      <div className="blog-post__bottom">
        <div className="blog-post__link">
          <div className="blog-post__link__text">Read More</div>
          <div className="blog-post__link__icon">
            <LinkBlog />
          </div>
        </div>
        <h4>{blogpost.name.split(":")[0]}</h4>
        <span>{blogpost.subheader}</span>
      </div>
      <div className="blog-post__img">
        <Image
          style={{ objectFit: "cover" }}
          fill
          src={blogpost.image}
          alt={`${blogpost.name} thumbnail`}
        />
      </div>
    </Link>
  );
};

export default BlogCard;

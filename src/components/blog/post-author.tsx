import React from "react";
import Image from "next/image";
import Link from "next/link";
import { timeAgoLong } from "@/helpers/time-ago-long";
import { BlogDate } from "../icons";
import { Author } from "@/types/blogpost-types";
import classNames from "classnames";

type Props = {
  author: Author;
  createdAt: Date;
  category?: React.ReactNode;
};

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function PostAuthor({ author, createdAt, category }: Props) {
  return (
    <div
      className={classNames("post-title__bottom", {
        "post-title__bottom--footer": category,
      })}
    >
      {category}
      <Link href={author.url} className="post-title__creator">
        <div className="post-title__creator__img">
          <Image
            src={author.image}
            alt={author.alt}
            width={26}
            height={26}
            style={{ borderRadius: 1000, objectFit: "cover" }}
          />
        </div>
        <div className="post-title__creator__title">{author.name}</div>
      </Link>
      <div className="post-title__date">
        <div className="post-title__date__icon">
          <BlogDate />
        </div>
        {!category && (
          <div className="post-title__date__ago">
            {timeAgoLong(createdAt.toString())}
          </div>
        )}

        <div className="post-title__date__date">
          {formatDate(new Date(createdAt))}
        </div>
      </div>
    </div>
  );
}

export default PostAuthor;

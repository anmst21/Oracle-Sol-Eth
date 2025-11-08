import React from "react";
import Link from "next/link";
import { BlogSubscribe as MailIcon } from "../icons";
import HeaderLogo from "../header/header-logo";

const BlogSubscribe = () => {
  return (
    <div className="blog-subscribe">
      <HeaderLogo />
      <div className="blog-subscribe__top">
        <h3>Oracle</h3>
        <div className="blog-subscribe__top__circles">
          <div className="blog-circle" />
          <div className="blog-circle" />
          <div className="blog-circle" />
        </div>
      </div>
      <div className="blog-subscribe__text">
        Oracle&apos;s Blog is designed to enable users around the world to get
        new relevant project information, share and save useful information.
      </div>

      <Link className="blog-subscribe__bottom" href={"/subscribe"}>
        <div className="blog-subscribe__bottom__text">Subscribe</div>
        <div className="blog-subscribe__bottom__icon">
          <MailIcon />
        </div>
      </Link>
    </div>
  );
};

export default BlogSubscribe;

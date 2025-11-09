import React from "react";

const CardOther = () => {
  return (
    <div className={`blog-post blog-post--active blog-post--1`}>
      <div className="blog-post__top">
        <span className="blog-post__top__other">Other Articles</span>
        {/* <div
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
        </div> */}
      </div>
      <div className="blog-post__bottom">
        {/* <div className="blog-post__link">
          <div className="blog-post__link__text">Read More</div>
          <div className="blog-post__link__icon">
            <LinkBlog />
          </div>
        </div>
        <h4>{blogpost.name.split(":")[0]}</h4>
        <span>{blogpost.subheader}</span> */}

        <h4 className="blog-post__bottom__more">More to Explore</h4>
        <p>
          Keep the flow going — explore more stories that shape the Oracle
          ecosystem and the tech behind it.
        </p>
      </div>
      {/* <div className="blog-post__img">
        <Image
          style={{ objectFit: "cover" }}
          fill
          src={blogpost.image}
          alt={`${blogpost.name} thumbnail`}
        />
      </div> */}
    </div>
  );
};

export default CardOther;

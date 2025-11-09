import { getBlogpost, getBlogposts } from "../../../../sanity/sanity-utils";
import BlogSubscribe from "@/components/blog/blog-subscribe";
import PostHeader from "@/components/blog/post-header";
import PostCategory from "@/components/blog/post-category";
import Image from "next/image";
import { PortableText } from "next-sanity";
import PostAuthor from "@/components/blog/post-author";
import TagsDivider from "@/components/blog/tags-divider";
import { Blogpost } from "@/types/blogpost-types";
import BlogCard from "@/components/blog/blog-card";
import CardOther from "@/components/blog/card-other";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { blogposts } = await getBlogposts();
  return blogposts.map((post) => ({
    slug: post.slug,
  }));
}

type Slug = {
  params: { slug: string };
  searchParams?: { category: string };
};

export async function generateMetadata({ params: { slug } }: Slug) {
  const project = await getBlogpost(slug);
  const postUrl = `https://oracleswap.app/blog/${slug}`;
  const imageUrl = project.image; // Ensure this is an absolute URL

  return {
    title: project.name,
    description: project.subheader,
    openGraph: {
      title: project.name,
      description: project.subheader,
      url: postUrl,

      images: [
        {
          url: imageUrl,
          alt: project.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.subheader,
      images: [imageUrl],
      site: "@0xN3XUS",
    },
  };
}

function getRandomPosts(posts: Blogpost[], count = 3): Blogpost[] {
  return posts
    .sort(() => Math.random() - 0.5) // shuffle
    .slice(0, count); // pick first N
}

export default async function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const postData = await getBlogpost(slug);

  if (!postData || Object.keys(postData).length === 0) {
    notFound();
  }

  const {
    name,
    image,
    subheader,
    _createdAt,
    author,
    alt,
    category,
    // slug,
    content,
    relatedPosts,
  } = postData;

  const randomPosts = getRandomPosts(relatedPosts, 3);

  console.log({ randomPosts });
  //   console.log({ blogPost });

  //   console.log("timeAgoLong", timeAgoLong(_createdAt.toString()));
  const { r, g, b } = category.textColor;

  return (
    <div className="blog-page blog-page-post">
      <PostHeader name={name} subheader={subheader} slug={slug} />

      <div className="post-title">
        <PostCategory
          r={r}
          g={g}
          b={b}
          slug={category.slug}
          title={category.title}
        />

        <h1>{name}</h1>

        <PostAuthor author={author} createdAt={_createdAt} />
      </div>
      <div className="post-image">
        <div className="post-image__container">
          <Image
            style={{ objectFit: "cover" }}
            fill
            src={image}
            alt={`${alt} thumbnail`}
          />
        </div>
      </div>
      <div className="blog-page-post__container">
        <div className="blog-page-post__portable">
          <PortableText value={content} />
        </div>
        <BlogSubscribe />
      </div>
      <TagsDivider />
      <PostAuthor
        category={
          <PostCategory
            r={r}
            g={g}
            b={b}
            slug={category.slug}
            title={category.title}
          />
        }
        author={author}
        createdAt={_createdAt}
      />
      <div className="blog-page__list blog-page-post__list">
        <CardOther />
        {randomPosts.map((blogpost, i) => {
          return <BlogCard key={i} blogpost={blogpost} index={i + 1} />;
        })}
      </div>
    </div>
  );
}

import { Metadata } from "next";
import { getBlogposts } from "../../../sanity/sanity-utils";
import BlogSubscribe from "@/components/blog/blog-subscribe";
import BlogHeader from "@/components/blog/blog-header";
import BlogCard from "@/components/blog/blog-card";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Explore the OracleSwap Blog for the latest updates, feature breakdowns, and insights into the multichain ecosystem. Learn how Oracle powers seamless swaps, bridges, and sends through Relay, Privy, and MoonPay. Stay informed with deep dives, product guides, and design philosophy behind the fastest cross-chain experience.",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { category: string };
}) {
  const { blogposts, categories } = await getBlogposts(searchParams?.category);

  if (blogposts.length === 0) {
    return;
  }

  // console.log("blogposts", date, month, year);
  return (
    <div className="blog-page">
      <div className="blog-page__main">
        <BlogHeader categories={categories} />
        <div className="blog-page__list">
          {blogposts.map((blogpost, i) => {
            return <BlogCard key={i} blogpost={blogpost} index={i} />;
          })}
        </div>
      </div>
      <BlogSubscribe />
    </div>
  );
}

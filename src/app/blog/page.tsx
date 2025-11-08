import { Metadata } from "next";
import { getBlogposts } from "../../../sanity/sanity-utils";
import BlogSubscribe from "@/components/blog/blog-subscribe";

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
  const { blogposts } = await getBlogposts(searchParams?.category);

  if (blogposts.length === 0) {
    return;
  }

  return (
    <div className="blog-page">
      {/* {blogposts.map((blogpost) => {
        return blogpost.name;
      })} */}
      <BlogSubscribe />
    </div>
  );
}

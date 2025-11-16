import BlogSubscribe from "@/components/blog/blog-subscribe";
import FooterForm from "@/components/footer/footer-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscribe to the Oracle Newsletter to stay updated on new releases, feature launches, and ecosystem insights. Get product updates, performance deep dives, and design philosophy delivered straight to your inbox — all in one place.",
};

export default function Page() {
  return (
    <div className="subscribe-page">
      <BlogSubscribe isSubscribe />
      <FooterForm />
    </div>
  );
}

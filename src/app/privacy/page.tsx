// export default function Page() {
//   return <div className="privacy-page"></div>;
// }

import { formatBlogDate } from "@/helpers/format-blog-date";
import { getPrivacy } from "../../../sanity/sanity-utils";
import { Metadata } from "next";
import { PortableText } from "next-sanity";

export const metadata: Metadata = {
  title: "Privacy Policy",

  description:
    "Understand how OracleSwap collects, processes, and protects your data. Learn about our non-custodial model, use of public blockchain information, integration with partners like Relay, MoonPay, and Privy, and your rights regarding privacy, security, and data access. Stay informed on how Oracle ensures transparency and safety across every transaction.",
};

export default async function Privacy() {
  const privacy = await getPrivacy();

  const { subheader, content, _createdAt, title, author } = privacy;

  // console.log("privacy", subheader);
  return (
    <div className="privacy-page">
      <div className="privacy-page__content">
        <h1>{title.split("—")[0]}</h1>
        <div className="privacy-page__author">
          <span>{author.name}</span>
          <div className="vert-divider" />
          <span>{formatBlogDate(_createdAt)}</span>
        </div>

        <PortableText value={subheader} />
        <div className="divider" />

        <div className="rich-text">
          <PortableText value={content} />
        </div>
      </div>
    </div>
  );
}

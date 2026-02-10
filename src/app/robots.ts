import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/transaction/"],
      },
    ],
    sitemap: "https://oracleswap.app/sitemap.xml",
  };
}

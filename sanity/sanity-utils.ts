import { Blogpost, Category, PrivacyPolicy } from "@/types/blogpost-types";
import { createClient, groq } from "next-sanity";

const config = {
  projectId: "a07lokcb",
  dataset: "production",
  apiVersion: "2023-03-04",
};

export async function getPrivacy(): Promise<PrivacyPolicy> {
  const client = createClient(config);

  const privacyPolicyQuery = groq`
  *[_type == "privacy"][0]{
    _id,
    _createdAt,
    title,
    author->{
        _id,
        name,
        "image": image.asset->url,
        "alt": image.alt,
      },
    subheader,
    content,

  }`;
  const privacy = await client.fetch<PrivacyPolicy>(privacyPolicyQuery);

  return privacy;
}

export async function getBlogposts(category?: string) {
  const client = createClient(config);

  const categoriesQuery = groq`
    *[_type == "category"]{
      _id,
      title,
      "slug": slug.current,
    }
  `;

  const categories = await client.fetch<Category[]>(categoriesQuery);

  const query = `{
  _id,
  _createdAt,
  name,
  subheader,
  "slug": slug.current,
  "image": image.asset->url,
  "alt": image.alt,
  featured,
  category->{
    _id,
    title,
    "slug": slug.current,
    textColor {
      r,
      g,
      b
    }
  },
  author->{
    _id,
    name,
    "image": image.asset->url,
    "alt": image.alt,
  },
}`;

  const blogpostQuery = groq`*[_type == "blogposts"] | order(_createdAt desc) ${query}`;

  const blogpostByCategoryQuery = groq`
  *[_type == "blogposts" && category->slug.current == $category] | order(_createdAt desc) ${query}
`;

  const decider = category
    ? client.fetch<Blogpost[]>(blogpostByCategoryQuery, { category })
    : client.fetch<Blogpost[]>(blogpostQuery);

  const [blogposts] = await Promise.all([decider]);
  return { blogposts, categories };
}

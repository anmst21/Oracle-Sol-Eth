import { Blogpost, Category, PrivacyPolicy } from "@/types/blogpost-types";
import { createClient, groq } from "next-sanity";

const config = {
  projectId: "a07lokcb",
  dataset: "production",
  apiVersion: "2023-03-04",
  useCdn: false,
};

const categoriesQuery = groq`
    *[_type == "category"]{
      _id,
      title,
      description,
      "slug": slug.current,
        textColor {
          r,
          g,
          b
        }
    }
  `;

const listBlogpostQuery = `{
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

export async function getHeaderModal() {
  const client = createClient(config);

  const blogpostQuery = groq`
          *[_type == "blogposts" && featured == true] | order(_createdAt asc) ${listBlogpostQuery}`;
  const categories = await client.fetch<Category[]>(categoriesQuery);
  const blogposts = await client.fetch<Blogpost[]>(blogpostQuery);

  return { categories, blogposts };
}

export async function getCategories(): Promise<Category[]> {
  const client = createClient(config);

  const categories = await client.fetch<Category[]>(categoriesQuery);

  return categories;
}

export async function getBlogpost(slug: string): Promise<Blogpost> {
  const client = createClient(config);

  // GROQ query to fetch the blog post by slug
  const blogpostQuery = groq`
    *[_type == "blogposts" && slug.current == $slug][0]{
      _id,
      _createdAt,
      name,
      subheader,
      "slug": slug.current,
      "image": image.asset->url,
      "alt": image.alt,
      content,
      pageTitle,
      author->{
        _id,
        name,
        "image": image.asset->url,
        "alt": image.alt,
        url
      },
      category->{
        _id,
        title,
        "slug": slug.current,
          textColor {
            r,
            g,
            b
        },
      },

    "relatedPosts": *[_type == "blogposts" && slug.current != $slug] ${listBlogpostQuery},

    }
  `;

  // GROQ query to fetch all categories

  const [blogpost] = await Promise.all([
    client.fetch<Blogpost>(blogpostQuery, { slug }),
  ]);

  return { ...blogpost };
}

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

  const categories = await client.fetch<Category[]>(categoriesQuery);

  const blogpostQuery = groq`*[_type == "blogposts"] | order(_createdAt asc) ${listBlogpostQuery}`;

  const blogpostByCategoryQuery = groq`
  *[_type == "blogposts" && category->slug.current == $category] | order(_createdAt desc) ${listBlogpostQuery}
`;

  const decider = category
    ? client.fetch<Blogpost[]>(blogpostByCategoryQuery, { category })
    : client.fetch<Blogpost[]>(blogpostQuery);

  const [blogposts] = await Promise.all([decider]);
  return { blogposts, categories };
}

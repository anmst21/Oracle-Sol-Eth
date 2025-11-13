import { PortableTextBlock } from "next-sanity";

export type Author = {
  _id: string;
  name: string;
  image: string;
  alt: string;
  resourceUri: string;
  url: string;
};

export type PrivacyPolicy = {
  _id: string;
  _createdAt: Date;
  title: string;
  author: Author;
  subheader: PortableTextBlock[];
  content: PortableTextBlock[];
};

export type Category = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  textColor: {
    r: number;
    g: number;
    b: number;
  };
};

export type Blogpost = {
  featured: boolean;
  _id: string;
  _createdAt: Date;
  name: string;
  slug: string;
  image: string;
  subheader: string;
  url: string;
  alt: string;
  content: PortableTextBlock[];
  author: Author;
  category: Category;
  relatedPosts: Blogpost[];
};

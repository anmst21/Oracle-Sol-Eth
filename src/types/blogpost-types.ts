import { PortableTextBlock } from "next-sanity";

export type Author = {
  _id: string;
  name: string;
  image: string;
  alt: string;
  resourceUri: string;
};

export type PrivacyPolicy = {
  _id: string;
  _createdAt: Date;
  title: string;
  author: Author;
  subheader: PortableTextBlock[];
  content: PortableTextBlock[];
};

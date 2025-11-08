import { PrivacyPolicy } from "@/types/blogpost-types";
import { createClient, groq } from "next-sanity";

export async function getPrivacy(): Promise<PrivacyPolicy> {
  const client = createClient({
    projectId: "a07lokcb",
    dataset: "production",
    apiVersion: "2023-03-04",
  });

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

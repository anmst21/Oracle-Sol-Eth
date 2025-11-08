const blogpost = {
  name: "blogposts",
  title: "Blogposts",

  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    {
      type: "boolean",
      name: "featured",
      title: "Featured",
      initialValue: false,
    },
    {
      name: "author",
      title: "Blogpost's Author",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "category",
      title: "Post's category",
      type: "reference",
      to: [{ type: "category" }],
    },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt", type: "string" }],
    },
    { name: "subheader", title: "Subheader", type: "string" },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};

export default blogpost;

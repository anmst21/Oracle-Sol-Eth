const author = {
  name: "author",
  title: "Author",

  type: "document",
  fields: [
    { name: "name", title: "Author's name", type: "string" },
    {
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt", type: "string" }],
    },
    { name: "url", title: "Author's URL", type: "url" },
  ],
};

export default author;

const category = {
  name: "category",
  title: "Category",

  type: "document",
  fields: [
    { name: "title", title: "Category", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "description", title: "Description", type: "string" },

    {
      name: "textColor",
      title: "Text Color",
      type: "object",
      fields: [
        { name: "r", title: "R", type: "number" },
        { name: "g", title: "G", type: "number" },
        { name: "b", title: "B", type: "number" },
      ],
    },
  ],
};

export default category;

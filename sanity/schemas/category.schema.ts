const category = {
  name: "category",
  title: "Category",

  type: "document",
  fields: [
    { name: "title", title: "Category", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
  ],
};

export default category;

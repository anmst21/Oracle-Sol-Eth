const privacy = {
  name: "privacy",
  title: "Privacy Policy",

  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    {
      name: "author",
      title: "Blogpost's Author",
      type: "reference",
      to: [{ type: "author" }],
    },
    {
      name: "subheader",
      title: "Sub Title",
      type: "array",
      of: [{ type: "block" }],
    },
    {
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
    },
  ],
};

export default privacy;
// {
//   name: "blogpost",
//   title: "Blogpost",
//   type: "array",
//   of: [
//     {
//       type: "object",
//       name: "headerEntry",
//       title: "Header Entry",
//       fields: [
//         {
//           name: "header",
//           type: "string",
//           title: "Header",
//         },
//         {
//           name: "paragraphs",
//           title: "Paragraphs",
//           type: "array",
//           of: [
//             // Here we use block content:
//             {
//               type: "block",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// },

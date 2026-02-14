import { Blogpost, Category } from "@/types/blogpost-types";
import Link from "next/link";
import {
  DropdownGuides,
  DropdownNews,
  DropdownVision,
  SwapArrow,
  NavigationBlog,
} from "@/components/icons";
import { homeBlogPosts } from "@/helpers/home-blog-posts";
import { parseDateHistory } from "@/helpers/parse-date-history";
import { motion } from "motion/react";

type Props = {
  blogposts: Blogpost[];
  categories: Category[];
};

const colors = [
  { r: 174, g: 233, b: 0 },
  { r: 235, g: 0, b: 59 },
];
const categoryIcons = [
  <DropdownNews key={0} />,
  <DropdownGuides key={1} />,
  <DropdownVision key={2} />,
];
const DropdownBlog = ({ blogposts, categories }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="dropdown-routes__wrapper dropdown-blog"
    >
      <div className="dropdown-routes">
        <div className="dropdown-blog__categories">
          {[...categories].reverse().map((category: Category, i) => {
            const { r, g, b } = category.textColor;

            return (
              <Link
                href={`/blog?category=${category.slug}`}
                className="dropdown-category"
                key={category._id}
              >
                <div className="dropdown-category__top">
                  <div
                    style={{
                      backgroundColor: `rgba(${r}, ${g}, ${b},0.1)`,
                      color: `rgba(${r}, ${g}, ${b}, 1)`,
                    }}
                    className="dropdown-category__top__tag"
                  >
                    #{category.title.toUpperCase()}
                  </div>
                  {categoryIcons[i]}
                </div>
                <div className="dropdown-category__text">
                  <h4>{category.title}</h4>
                  <span>{category.description}</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="dropdown-blog__posts">
          {blogposts.map((post, i) => {
            const { r, g, b } = colors[i];

            const homeBlogPost = homeBlogPosts.find(
              (blogPost) => blogPost.href === "/" + post.slug
            );

            const [date, monthYear] = parseDateHistory(
              post._createdAt.toString()
            );
            const [month, year] = monthYear.split(" ");

            return (
              <Link
                href={`/blog/${post.slug}`}
                className="dropdown-category dropdown-post"
                key={post._id}
              >
                <div className="dropdown-category__top">
                  <div
                    style={{
                      backgroundColor: `rgba(${r}, ${g}, ${b},0.1)`,
                      color: `rgba(${r}, ${g}, ${b}, 1)`,
                    }}
                    className="dropdown-category__top__tag"
                  >
                    #{post.category.title.toUpperCase()}
                  </div>
                  {homeBlogPost?.icon}
                </div>
                <div className="dropdown-category__text dropdown-post__text">
                  <h4>{post.name.split(":")[0]}</h4>
                  <span>{homeBlogPost?.leadLine}</span>
                </div>
                <div className="dropdown-post__bot">
                  <span>
                    {date} {month}, {year}
                  </span>
                  <div className="dropdown-post__arrow">
                    <SwapArrow />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="dropdown-blog__bot">
          <div className="dropdown-blog__bot__icon">
            <NavigationBlog />
          </div>
          <div className="dropdown-blog__bot__title">
            Browse all posts and dive deeper into Oracle.
          </div>
          <Link href="/blog" className="dropdown-blog__bot__link">
            <span>Explore</span>
            <SwapArrow />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default DropdownBlog;

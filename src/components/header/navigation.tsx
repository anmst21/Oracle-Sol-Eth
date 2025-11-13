"use client";

import React from "react";
import { motion } from "motion/react";
import { Blogpost, Category } from "@/types/blogpost-types";
import NavigationItem from "./navigation-item";
import { useRouteOptions } from "@/hooks/useRouteOptions";

const Navigation = ({
  isHomeRoute,
  categories,
  blogposts,
}: {
  blogposts: Blogpost[];
  categories: Category[];
  isHomeRoute: boolean;
}) => {
  const { navigationItemsMain, navigationItemsHome } = useRouteOptions({
    categories,
    blogposts,
  });

  return (
    <motion.div className="header-navigation">
      {(isHomeRoute ? navigationItemsHome : navigationItemsMain).map((item) => {
        return <NavigationItem key={item.slug} item={item} />;
      })}
    </motion.div>
  );
};

export default Navigation;

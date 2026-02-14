import React from "react";
import Link from "next/link";
import { DropdownCheck } from "../icons";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import classNames from "classnames";
import { motion } from "motion/react";

type Props = {
  routes: {
    name: string;
    icon: React.JSX.Element;
    description: string;
    slug: string;
    isVisible: boolean;
  }[];
};

const DropdownRoutes = ({ routes }: Props) => {
  const pathname = usePathname();
  const { push } = useRouter();
  const [activeRoute, setActiveRoute] = useState(
    () => routes.find((route) => route.slug === pathname) || null
  );

  const displayedRoute = activeRoute ? activeRoute : routes[0];

  const animatedProps = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
    transition: { duration: 0.2, ease: "easeOut" },
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="dropdown-routes__wrapper"
    >
      <div className="dropdown-routes">
        <div className="dropdown-routes__list">
          {routes.filter((r) => r.isVisible).map((route, i) => {
            return (
              <Link
                className={classNames("dropdown-routes__btn", {
                  "dropdown-routes__btn--active": pathname.includes(route.slug),
                  "dropdown-routes__btn--displayed":
                    route.slug === activeRoute?.slug,
                  "dropdown-routes__btn--uncheck":
                    pathname.includes(route.slug) &&
                    route.slug !== activeRoute?.slug,
                })}
                onMouseEnter={() => setActiveRoute(route)}
                href={route.slug}
                key={i}
              >
                <div className="dropdown-routes__btn__icon">{route.icon}</div>
                <span>{route.name}</span>
                <div className="dropdown-routes__btn__check">
                  <DropdownCheck />
                </div>
              </Link>
            );
          })}
        </div>
        <motion.div
          onClick={() => push(activeRoute?.slug || "")}
          className="dropdown-routes__active"
        >
          <motion.div
            key={`active-nav-card-top-${activeRoute?.slug}`}
            {...animatedProps}
            className="dropdown-routes__top"
          >
            <div className="dropdown-routes__top__tag">
              {"#"}
              {displayedRoute.name.toUpperCase()}
            </div>
            <div className="dropdown-routes__top__icon">
              {displayedRoute.icon}
            </div>
          </motion.div>
          <motion.div
            key={`active-nav-card-text-${activeRoute?.slug}`}
            {...animatedProps}
            className="dropdown-routes__text"
          >
            {displayedRoute.description}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DropdownRoutes;

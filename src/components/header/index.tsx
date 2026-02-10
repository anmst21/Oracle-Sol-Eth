"use client";

import { BtnPolygons, HeaderCross } from "../icons";
import Navigation from "./navigation";
import Wallet from "./wallet";
import HeaderLogo from "./header-logo";
import { usePathname, useRouter } from "next/navigation";
import { Blogpost, Category } from "@/types/blogpost-types";

const Header = ({
  categories,
  blogposts,
}: {
  blogposts: Blogpost[];
  categories: Category[];
}) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const isHomeRoute =
    pathname.includes("/blog") ||
    pathname.includes("/contacts") ||
    pathname.includes("/privacy") ||
    pathname.includes("/subscribe") ||
    pathname === "/";
  return (
    <div className="header">
      <div className="header__cross">
        <HeaderCross />
      </div>

      <div className="header__side-divider" />
      <div className="header__inner">
        <HeaderLogo isRedirect />
        <div className="divider">
          <div />
        </div>
        <Navigation
          categories={categories}
          blogposts={blogposts}
          isHomeRoute={isHomeRoute}
        />
        <div className="divider-long" />
        {/* <Theme />
      <div className="divider">
        <div />
      </div> */}
        {isHomeRoute ? (
          <button
            onClick={() => push("/swap")}
            className="buy-btn buy-btn--active confirmation__buttons__cta"
          >
            <span>Visit App</span>
            <BtnPolygons />
          </button>
        ) : (
          <Wallet />
        )}
      </div>
      <div className="header__side-divider" />
      <div className="header__cross">
        <HeaderCross />
      </div>
    </div>
  );
};

export default Header;

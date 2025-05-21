import React from "react";
import { HeaderTheme } from "../icons";

type Props = {};

const Theme = (props: Props) => {
  return (
    <button className="header-theme">
      <HeaderTheme />
      <span>Theme</span>
    </button>
  );
};

export default Theme;

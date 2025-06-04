import React from "react";
import { ChevDownFooter, HeaderCross } from "../icons";

const HeaderFooter = () => {
  return (
    <div className="header-footer">
      <div className="header__cross">
        <HeaderCross />
      </div>
      <div className="divider-long" />
      <ChevDownFooter />
      <div className="divider-long" />
      <ChevDownFooter />
      <div className="divider-long" />
      <ChevDownFooter />
      <div className="divider-long" />
      <div className="header__cross">
        <HeaderCross />
      </div>
    </div>
  );
};

export default HeaderFooter;

import React from "react";
import AnimatedSquares from "./animated-squares";
import HeaderLogo from "../header/header-logo";
import FooterForm from "./footer-form";
import AnimatedDots from "./animated-dots";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer__animation">
        <div className="footer__animation__header">
          <HeaderLogo />
          <h3>Oracle</h3>
        </div>
        <AnimatedSquares />
      </div>
      <div className="footer-main">
        <div className="footer-main__left">
          <h2>Sign up for the latest news</h2>
          <FooterForm />
          <AnimatedDots />
          <div className="footer-main__bottom">
            <h4>© 2025 Oracle</h4>
            <Link href={"/privacy#terms"}>Terms of service</Link>
            <Link href={"/privacy#statement"}>Privacy Statement</Link>
          </div>
        </div>
        <div className="footer-main__right">
          <div className="footer-main__right__landing">
            <Link href={"/#hero"}>Hero</Link>
            <Link href={"/#about"}>About</Link>
            <Link href={"/#stats"}>Stats</Link>
            <Link href={"/#features"}>Features</Link>
            <Link href={"/#chart"}>Chart</Link>
            <Link href={"/#feed"}>Feed</Link>
            <Link href={"/#stakeholders"}>Stakeholders</Link>
            <Link href={"/#values"}>Values</Link>
          </div>
          <div className="footer-main__right__sitemap">
            <div className="footer-main__right__sitemap__container">
              <Link href={"/swap"}>Swap</Link>
              <Link href={"/buy"}>Buy</Link>
              <Link href={"/chart"}>Chart</Link>
              <Link href={"/feed"}>Feed</Link>
              <Link href={"/coins"}>Coins</Link>
            </div>
            <Link className="footer-main__contacts" href={"/contacts"}>
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

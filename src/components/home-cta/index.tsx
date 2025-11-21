import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HomeLaunch } from "../icons";
const bgImage =
  "https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/oracleswap/cta-test-bg.jpg";

const HomeCta = () => {
  return (
    <div id="values" className="home-cta">
      <div className="home-cta__text">
        <h2>Move Value the Way It Should Be</h2>
        <span>
          Fast execution, real transparency, and multichain freedom — all in one
          seamless flow.
        </span>
      </div>
      <div className="home-cta__container">
        <Image
          style={{ objectFit: "cover" }}
          fill
          src={bgImage}
          alt="Cta bg test"
        />
        <div className="home-cta__card">
          <div className="home-cta__card__badge">Oracle Team</div>
          <h3>Oracle</h3>
          <span className="home-cta__card__paragraph">
            Oracle brings swapping, bridging, and sending into a single, fluid
            experience powered by Relay. Fast fills, clear fees, verified data,
            and frictionless wallet control — everything you need to move value
            across chains with confidence.
          </span>
          <Link className="home-cta__card__cta" href={"/swap"}>
            <HomeLaunch />
            <div className="home-cta__card__cta__mid">
              <HomeLaunch />
              <span>Visit App</span>
              <HomeLaunch />
            </div>
            <HomeLaunch />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeCta;

//Move Value the Way It Should Be
//Fast execution, real transparency, and multichain freedom — all in one seamless flow.

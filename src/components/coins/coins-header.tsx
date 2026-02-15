"use client";

import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { motion } from "motion/react";

import { useRouter, usePathname } from "next/navigation";

const btnsArray = [
  { href: "/community", key: "Community" },
  { href: "/ethereum", key: "Ethereum" },
  { href: "/solana", key: "Solana" },
];

const CoinsHeader = () => {
  const pathname = usePathname();
  const { push } = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);

  const activeKey =
    btnsArray.find((btn) => pathname === "/coins" + btn.href)?.key ?? btnsArray[0].key;

  useEffect(() => {
    const node = btnRefs.current.get(activeKey);
    if (node && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = node.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      setUnderline({
        left: itemRect.left - containerRect.left + scrollLeft,
        width: itemRect.width,
      });
      setReady(true);
    }
  }, [activeKey]);

  return (
    <div className="coins-header">
      <div className="coins-header__navigation" ref={containerRef}>
        {btnsArray.map((btn) => {
          const toPath = "/coins" + btn.href;
          return (
            <button
              ref={(el) => {
                if (el) btnRefs.current.set(btn.key, el);
              }}
              className={classNames("coins-header__navigation__button", {
                "coins-header__navigation__button--active": toPath === pathname,
              })}
              onClick={() => push(toPath)}
              key={btn.key}
            >
              {btn.key}
            </button>
          );
        })}
        {ready && (
          <motion.div
            className="underline"
            animate={{ left: underline.left, width: underline.width }}
            transition={{ type: "tween", ease: "easeOut", duration: 0.2 }}
            style={{ position: "absolute", bottom: 0 }}
          />
        )}
      </div>
    </div>
  );
};

export default CoinsHeader;

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { motion } from "motion/react";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import SearchGlass from "../icons/SearchGlass";
import InputCross from "../icons/InputCross";

const btnsArray = [
  { href: "/community", key: "Community" },
  { href: "/ethereum", key: "Ethereum" },
  { href: "/solana", key: "Solana" },
];

const CoinsHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDesktop = useIsDesktop();
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [underline, setUnderline] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapperRef = useRef<HTMLDivElement>(null!) as React.RefObject<HTMLDivElement>;

  const activeKey =
    btnsArray.find((btn) => pathname === "/coins" + btn.href)?.key ?? btnsArray[0].key;

  const recalcUnderline = useCallback(() => {
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

  useEffect(() => {
    recalcUnderline();
  }, [recalcUnderline]);


  // Clear search when tab changes
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setSearchTerm("");
      setIsExpanded(false);
    }
  }, [pathname]);

  // Sync search term to URL
  useEffect(() => {
    const newUrl = searchTerm
      ? `${pathname}?q=${encodeURIComponent(searchTerm)}`
      : pathname;
    router.replace(newUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, pathname]);

  // Auto-focus on expand
  useEffect(() => {
    if (!isDesktop && isExpanded) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [isDesktop, isExpanded]);

  // Click-outside to collapse on mobile
  useEffect(() => {
    if (isDesktop || !isExpanded) return;
    const handler = (e: MouseEvent) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isDesktop, isExpanded]);

  const handleClear = useCallback(() => {
    setSearchTerm("");
    if (!isDesktop) setIsExpanded(false);
  }, [isDesktop]);

  const isMobileCollapsed = !isDesktop && !isExpanded;

  return (
    <div className="coins-header">
      <motion.div
        className="coins-header__navigation"
        ref={containerRef}
        initial={false}
        animate={
          !isDesktop
            ? { flex: isExpanded ? "1 0 0px" : "1 1 auto" }
            : undefined
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
        onUpdate={!isDesktop ? recalcUnderline : undefined}
      >
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
              onClick={() => router.push(toPath)}
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
      </motion.div>

      <motion.div
        className="coins-header__search"
        ref={searchWrapperRef}
        initial={false}
        animate={
          !isDesktop
            ? { width: isExpanded ? 200 : 36, flex: "0 0 auto" }
            : undefined
        }
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {isMobileCollapsed ? (
          <button
            className="chain-sidebar__input chain-sidebar__input--search-btn"
            onClick={() => setIsExpanded(true)}
          >
            <SearchGlass />
          </button>
        ) : (
          <label className="chain-sidebar__input">
            <SearchGlass />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search coins"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {!isDesktop && (
              <button
                onClick={handleClear}
                className="chain-sidebar__input__abandon"
              >
                <InputCross />
              </button>
            )}
            {isDesktop && searchTerm.length > 0 && (
              <button
                onClick={handleClear}
                className="chain-sidebar__input__abandon"
              >
                <InputCross />
              </button>
            )}
          </label>
        )}
      </motion.div>
    </div>
  );
};

export default CoinsHeader;

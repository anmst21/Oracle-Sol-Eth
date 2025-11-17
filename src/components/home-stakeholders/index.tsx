"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { stakeholdersList } from "./stakeholders";
import Circle from "./circle";
import HoverCircle from "./hover-circle";
import { ActiveItem, stakeholderItems, StakeholderType } from "./types";
import classNames from "classnames";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import HomeSectionHeader from "../home-section-header";
import { HomeHeaderType } from "@/types/home-page";
import Link from "next/link";

const HomeStakeholders = () => {
  const [activeType, setActiveType] = useState<StakeholderType>("featured");
  const [activeItem, setActiveItem] = useState<ActiveItem>({
    type: "featured",
    id: "base",
  });

  console.log({ activeItem });

  const handleItemClick = useCallback(
    (type: StakeholderType, id: string) => {
      setActiveType(type);
      setActiveItem({ type, id });
    },
    [setActiveType, setActiveItem]
  );

  const sectionColors: Record<StakeholderType, string> = {
    featured: "#afe900",
    swap: "#00B0EB",
    coins: "#00EBB0",
    social: "#FFFFFF",
    creator: "#EB00B0",
    data: "#EB8900",
    protocol: "#EB003B",
  };

  const activeImage = useMemo(
    () => stakeholdersList.find((item) => item.key === activeItem?.id),
    [activeItem]
  );

  const smoothAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.2, ease: "easeInOut" },
  } as const;

  const textAnimation = {
    initial: { opacity: 0, x: 10 },
    animate: {
      opacity: 1,
      x: 0,
    },
    transition: { duration: 0.2, ease: "easeInOut" },
    exit: {
      opacity: 0,
      x: 10,
    },
  } as const;

  const getNextItem = (current: ActiveItem): ActiveItem => {
    const currentIndex = stakeholderItems.findIndex(
      (item) => item.key === current.id
    );

    // if "base" or not found -> go to first item
    if (currentIndex === -1) {
      const first = stakeholderItems[0];
      return {
        type: first.category as StakeholderType,
        id: first.key,
      };
    }

    // normal next index with wrap-around
    const nextIndex = (currentIndex + 1) % stakeholderItems.length;
    const next = stakeholderItems[nextIndex];

    return {
      type: next.category as StakeholderType,
      id: next.key,
    };
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const active = getNextItem(activeItem);
      setActiveItem(active);
      setActiveType(active.type);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeItem]);

  return (
    <div className="home-stakeholders">
      <HomeSectionHeader type={HomeHeaderType.Stakeholders} />

      <div className="home-stakeholders__container">
        <div className="home-stakeholders__text">
          {/* <AnimatePresence mode="sync"> */}
          {activeImage && (
            <>
              <motion.h3 key={"header-" + activeItem?.id} {...textAnimation}>
                {activeImage.header.split(" ")[0]}
              </motion.h3>
              <motion.p {...textAnimation} key={"paragraph-" + activeItem?.id}>
                {activeImage.description}
              </motion.p>

              <motion.div
                key={"badge-" + activeItem?.id}
                {...textAnimation}
                style={{
                  color: sectionColors[activeImage.type as StakeholderType],
                }}
                className="home-stakeholders__text__badge"
              >
                {"#"}
                {activeImage.type}
              </motion.div>
            </>
          )}
          {/* </AnimatePresence> */}
        </div>

        <div className="home-stakeholders__circles">
          <AnimatePresence mode="sync">
            {activeImage && (
              <motion.div
                key={activeItem?.id}
                className="home-stakeholders__image"
                {...smoothAnimation}
              >
                <Link
                  style={{ display: "flex" }}
                  target="_blank"
                  href={activeImage.uri}
                >
                  <Image
                    alt={activeImage.header}
                    src={activeImage.icon}
                    width={activeImage.width}
                    height={activeImage.height}
                  />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <Circle activeType={activeType} activeItem={activeItem} />
          <HoverCircle handleItemClick={handleItemClick} />

          {stakeholdersList.map((stakeholderBadge, i) => {
            return (
              <div
                style={{
                  color:
                    sectionColors[stakeholderBadge.type as StakeholderType],
                }}
                key={i}
                className={classNames(
                  `stakeholder-badge stakeholder-badge__${stakeholderBadge.key}`,
                  {
                    "stakeholder-badge--visible":
                      stakeholderBadge.type === activeType,
                    "stakeholder-badge--active":
                      stakeholderBadge.key === activeItem?.id,
                  }
                )}
              >
                {stakeholderBadge.header.split(" ")[0]}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeStakeholders;

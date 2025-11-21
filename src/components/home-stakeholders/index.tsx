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
import MobileCarousel from "./carousel";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import {
  sectionColors,
  ROTATIONS,
  ITEMS_COUNT,
  smoothAnimation,
  textAnimation,
} from "./helpers";

const HomeStakeholders = () => {
  const isDesktop = useIsDesktop();

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

  const activeImage = useMemo(
    () => stakeholdersList.find((item) => item.key === activeItem?.id),
    [activeItem]
  );

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
    if (!isDesktop) return;
    const timer = setTimeout(() => {
      const active = getNextItem(activeItem);
      setActiveItem(active);
      setActiveType(active.type);
    }, 5000);

    return () => clearTimeout(timer);
  }, [activeItem, isDesktop]);
  //1024px

  const [scrollProgress, setScrollProgress] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ playOnInit: true, delay: 5000 }),
  ]);
  // console.log({ scrollProgress });

  useEffect(() => {
    if (!emblaApi || isDesktop) return;

    let frameId: number;

    const loop = () => {
      const progress = emblaApi.scrollProgress(); // 0 → 1
      setScrollProgress(progress);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frameId);
  }, [emblaApi, isDesktop]);

  const wheelRotation = useMemo(() => {
    // keep it in [0, 1)
    const p = ((scrollProgress % 1) + 1) % 1;

    // each item takes equal share of progress
    const step = 1 / ITEMS_COUNT; // ~ 0.071428...

    // 0..13.999
    const idxFloat = p / step;

    // current "from" index
    const fromIndex = Math.floor(idxFloat); // 0..13

    // local progress between fromIndex and next index
    const t = idxFloat - fromIndex; // 0..1

    const toIndex = (fromIndex + 1) % ITEMS_COUNT;

    const fromAngle = ROTATIONS[fromIndex];
    const toAngle = ROTATIONS[toIndex];

    // linear interpolation between the two angle stops
    return fromAngle + (toAngle - fromAngle) * t;
  }, [scrollProgress]);

  useEffect(() => {
    if (!emblaApi || isDesktop) return;

    const handleSelect = () => {
      const index = emblaApi.selectedScrollSnap(); // 0..N-1

      const item = stakeholderItems[index];
      if (!item) return;

      setActiveItem({
        type: item.category as StakeholderType,
        id: item.key,
      });
      setActiveType(item.category as StakeholderType);
    };

    // Run once on mount so state matches initial slide
    handleSelect();

    emblaApi.on("select", handleSelect);
    emblaApi.on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect);
      emblaApi.off("reInit", handleSelect);
    };
  }, [emblaApi, isDesktop]);

  useEffect(() => {
    if (!emblaApi || isDesktop) return;

    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;

    const scheduleRestart = () => {
      autoplay.play();
    };

    emblaApi.on("pointerUp", scheduleRestart);

    return () => {
      emblaApi.off("pointerUp", scheduleRestart);
    };
  }, [emblaApi, isDesktop]);

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
          {!isDesktop && (
            <MobileCarousel stakeholders={stakeholdersList} ref={emblaRef} />
          )}

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
          <Circle
            rotation={isDesktop ? 0 : wheelRotation}
            activeType={activeType}
            activeItem={activeItem}
          />
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

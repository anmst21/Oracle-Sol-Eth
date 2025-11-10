"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

const colorStages = [0, 0, 0, 0.1, 0.1, 0.2, 0.5, 0.7, 1];

import React, { useEffect, useState } from "react";

function getRandomOpacity<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const RECT_COUNT = 60;

const HeroCarousel = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [
    AutoScroll({ playOnInit: true, speed: 0.8 }),
  ]);

  const [opacities, setOpacities] = useState(
    Array.from({ length: RECT_COUNT }, () => ({
      top: getRandomOpacity(colorStages),
      bot: getRandomOpacity(colorStages),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setOpacities((prev) =>
        prev.map(() => ({
          top: getRandomOpacity(colorStages),
          bot: getRandomOpacity(colorStages),
        }))
      );
    }, 2500); // change every 2s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-carousel">
      <div className="hero-carousel__viewport" ref={emblaRef}>
        <div className="hero-carousel__container">
          {opacities.map((rect, i) => (
            <div key={i} className="rect-carousel-item">
              <div
                className="rect-top"
                style={{
                  opacity: rect.top,
                  transition: "opacity 3.0s ease",
                }}
              />
              <div
                className="rect-bottom"
                style={{
                  opacity: rect.bot,
                  transition: "opacity 3.0s ease",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;

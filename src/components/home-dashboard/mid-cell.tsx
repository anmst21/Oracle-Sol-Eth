"use client";

import { useEffect, useRef, useState } from "react";
import { NavigationEthereum, NavigationSolana } from "@/components/icons";
import { greyEq } from "@/components/icons/dashboard";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { animate } from "animejs";

type Props = {
  type: "base" | "solana";
  index?: number; // for staggered offsets
  value: string;
};

function scrambleValue(final: string): string {
  return final
    .split("")
    .map((ch) => (/\d/.test(ch) ? String(Math.floor(Math.random() * 10)) : ch))
    .join("");
}

const MidCell = ({ type, index = 0, value }: Props) => {
  const isBase = type === "base";
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const valueRef = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(scrambleValue(value));

  useEffect(() => {
    if (!lottieRef.current) return;

    const delay = index * 200 + Math.random() * 300;

    const timeout = setTimeout(() => {
      lottieRef.current?.play();
      lottieRef.current?.setSpeed(0.8 + Math.random() * 0.4);
    }, delay);

    return () => clearTimeout(timeout);
  }, [index]);

  useEffect(() => {
    const el = valueRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Scramble digits rapidly, then settle on final value
            const obj = { progress: 0 };
            const chars = value.split("");
            const digitIndices = chars.reduce<number[]>((acc, ch, i) => {
              if (/\d/.test(ch)) acc.push(i);
              return acc;
            }, []);

            animate(obj, {
              progress: [0, 1],
              duration: 1500,
              delay: index * 300,
              ease: "inOutQuint",
              onUpdate: () => {
                const arr = chars.slice();
                for (const i of digitIndices) {
                  // Each digit locks in at a different threshold
                  const lockAt = (digitIndices.indexOf(i) + 1) / digitIndices.length;
                  if (obj.progress < lockAt * 0.85) {
                    arr[i] = String(Math.floor(Math.random() * 10));
                  }
                }
                setDisplay(arr.join(""));
              },
              onComplete: () => setDisplay(value),
            });

            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, index]);

  return (
    <div className={`dashboard-mid-cell  dashboard-mid-cell--${type}`}>
      <div className="dashboard-mid-cell__top">
        <span>{isBase ? "Base" : "Solana"}</span>
        {isBase ? <NavigationEthereum /> : <NavigationSolana />}
      </div>

      <p>
        {isBase
          ? "A snapshot of Base's most recent activity."
          : "Solana's high-speed ecosystem routed through Relay."}
      </p>

      <div className="dashboard-mid-cell__value" ref={valueRef}>
        <span>{"$ "}</span>
        {display}
      </div>

      <div className="dashboard-mid-cell__bot">
        <span>
          Volume Over Last <span>30 Days</span>
        </span>
        <Lottie
          lottieRef={lottieRef}
          animationData={greyEq}
          loop
          autoplay={false} // controlled manually
          style={{
            width: 36,
            height: 12,
          }}
        />
      </div>
    </div>
  );
};

export default MidCell;

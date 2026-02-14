"use client";

import { useEffect, useRef } from "react";

type AsciiEngineInstance = {
  pause: () => void;
  resume: () => void;
  dispose: () => void;
};

const Animation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<AsciiEngineInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let disposed = false;

    import("../home-about/ascii-engine").then(({ AsciiEngine }) => {
      if (disposed || !container) return;
      const engine = new AsciiEngine({
        container,
        modelUrl: "/objects/cup.glb",
        rotation: [-2, -0.7, 0.2],
        gridRows: 60,
        modelScale: 3.2,
        clearAlpha: 0,
      });
      engineRef.current = engine;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            engineRef.current?.resume();
          } else {
            engineRef.current?.pause();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(container);

    return () => {
      disposed = true;
      observer.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  return (
    <div className="home-dashboard__animation">
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      />
    </div>
  );
};

export default Animation;

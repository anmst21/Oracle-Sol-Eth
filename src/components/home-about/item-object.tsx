"use client";

import { useEffect, useRef } from "react";

type Props = {
  objectUri: string;
  rotation?: number[];
};

type AsciiEngineInstance = {
  pause: () => void;
  resume: () => void;
  dispose: () => void;
};

const ItemObject = ({ objectUri, rotation }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<AsciiEngineInstance | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    let disposed = false;

    import("./ascii-engine").then(({ AsciiEngine }) => {
      if (disposed || !container) return;
      const engine = new AsciiEngine({
        container,
        modelUrl: objectUri,
        rotation: rotation as [number, number, number] | undefined,
      });
      engineRef.current = engine;
    });

    // IntersectionObserver for pause/resume
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
      { threshold: 0.1 }
    );

    observer.observe(container);

    return () => {
      disposed = true;
      observer.disconnect();
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [objectUri]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        zIndex: 50,
      }}
    />
  );
};

export default ItemObject;

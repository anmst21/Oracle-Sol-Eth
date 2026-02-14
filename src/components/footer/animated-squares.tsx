"use client";

import React, { useLayoutEffect, useMemo, useRef } from "react";
import { palette as paletteCreator } from "./create-palette";
import { animate, stagger } from "animejs";

const gridWidth = 56;
const gridHeight = 10;

// Opacity levels
const OPACITY_CORE = 1; // inside 2×2
const OPACITY_EDGE = 0.3; // orthogonally adjacent to 2×2
const OPACITY_CORNER_1 = 0.1; // diagonally touching (dx=1,dy=1)
const OPACITY_NEXT = 0.05; // orthogonal two away
const OPACITY_CORNER_2 = 0.05; // “knight” cells (2,1) or (1,2)
const OPACITY_BASE = 0.0;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const CELL_DESKTOP = 20;
const GAP_DESKTOP = 6;
const CELL_MOBILE = 10;
const GAP_MOBILE = 3;
const MD_BREAKPOINT = 1024;

function getCellGap(width: number) {
  return width < MD_BREAKPOINT
    ? { cell: CELL_MOBILE, gap: GAP_MOBILE }
    : { cell: CELL_DESKTOP, gap: GAP_DESKTOP };
}

function computeCols(containerWidth: number, cell: number, gap: number, mustBeEven = true) {
  let n = Math.floor((containerWidth + gap) / (cell + gap));
  if (n < 2) n = 2;
  if (mustBeEven && n % 2) n -= 1;
  return n;
}

const AnimatedSquares: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const palette = useMemo(() => paletteCreator(gridWidth * gridHeight), []);

  const [cols, setCols] = React.useState(56);
  const [sizes, setSizes] = React.useState({ cell: CELL_DESKTOP, gap: GAP_DESKTOP });
  const containerWidthPx = React.useMemo(
    () => cols * sizes.cell + (cols - 1) * sizes.gap,
    [cols, sizes]
  );

  // Measurements
  const boundsRef = useRef<DOMRect | null>(null);
  const cellWRef = useRef(0);
  const cellHRef = useRef(0);

  // DOM + state refs
  const squaresRef = useRef<HTMLDivElement[]>([]);
  const rafPendingRef = useRef(false);
  const currentAnchorRef = useRef<{ ax: number; ay: number } | null>(null);

  // Animation control
  const animQueueRef = useRef<number[]>([]);
  const isRunningRef = useRef(false);
  const animInstanceRef = useRef<ReturnType<typeof animate> | null>(null);

  const centerAnchor = () => ({
    ax: Math.floor((gridWidth - 2) / 2),
    ay: Math.floor((gridHeight - 2) / 2),
  });

  const refreshBounds = () => {
    if (!gridRef.current) return;
    const b = gridRef.current.getBoundingClientRect();
    boundsRef.current = b;
    cellWRef.current = b.width / gridWidth;
    cellHRef.current = b.height / gridHeight;
  };

  const scanSquares = () => {
    if (!gridRef.current) return;
    squaresRef.current = Array.from(
      gridRef.current.querySelectorAll<HTMLDivElement>(".square")
    );
  };

  // --- 2×2 core fading logic
  const applyBlockOpacities = (ax: number, ay: number) => {
    for (let i = 0; i < squaresRef.current.length; i++) {
      const x = i % gridWidth;
      const y = Math.floor(i / gridWidth);

      const dx = x < ax ? ax - x : x > ax + 1 ? x - (ax + 1) : 0;
      const dy = y < ay ? ay - y : y > ay + 1 ? y - (ay + 1) : 0;

      let opacity = OPACITY_BASE;
      if (dx === 0 && dy === 0) opacity = OPACITY_CORE;
      else if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1))
        opacity = OPACITY_EDGE;
      else if (dx === 1 && dy === 1) opacity = OPACITY_CORNER_1;
      else if ((dx === 2 && dy === 0) || (dx === 0 && dy === 2))
        opacity = OPACITY_NEXT;
      else if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2))
        opacity = OPACITY_CORNER_2;

      squaresRef.current[i].style.opacity = String(opacity);
    }
  };

  const scheduleApply = (ax: number, ay: number) => {
    currentAnchorRef.current = { ax, ay };
    if (rafPendingRef.current) return;

    rafPendingRef.current = true;
    requestAnimationFrame(() => {
      rafPendingRef.current = false;
      const a = currentAnchorRef.current;
      if (!a) return;
      applyBlockOpacities(a.ax, a.ay);
    });
  };

  const pointerToAnchor = (clientX: number, clientY: number) => {
    if (!boundsRef.current) refreshBounds();
    const b = boundsRef.current!;
    const cw = cellWRef.current || 1;
    const ch = cellHRef.current || 1;

    const relX = clamp(clientX - b.left, 0, b.width - 0.0001);
    const relY = clamp(clientY - b.top, 0, b.height - 0.0001);

    const u = relX / cw;
    const v = relY / ch;

    const ax = clamp(Math.floor(u - 0.5), 0, gridWidth - 2);
    const ay = clamp(Math.floor(v - 0.5), 0, gridHeight - 2);

    return { ax, ay };
  };

  // Lifecycle
  useLayoutEffect(() => {
    const root = rootRef.current;
    const grid = gridRef.current;
    if (!root || !grid) return;

    refreshBounds();
    scanSquares();

    const c = centerAnchor();
    scheduleApply(c.ax, c.ay);

    const ro = new ResizeObserver(() => {
      const width = root.clientWidth;
      const { cell, gap } = getCellGap(width);
      setSizes({ cell, gap });
      setCols(computeCols(width, cell, gap, true));
      refreshBounds();
      const a = currentAnchorRef.current ?? centerAnchor();
      scheduleApply(a.ax, a.ay);
    });
    ro.observe(root);
    ro.observe(grid);

    const onPointerMove = (e: PointerEvent) => {
      if (isRunningRef.current || animQueueRef.current.length) return;
      const a = pointerToAnchor(e.clientX, e.clientY);
      scheduleApply(a.ax, a.ay);
    };

    const onPointerLeave = () => {
      if (isRunningRef.current || animQueueRef.current.length) return;
      const a = centerAnchor();
      scheduleApply(a.ax, a.ay);
    };

    const onPointerUp = () => {
      if (isRunningRef.current || animQueueRef.current.length) return;
      const a = centerAnchor();
      scheduleApply(a.ax, a.ay);
    };

    const onScroll = () => {
      // Invalidate cached bounds; next pointer event will recalculate
      boundsRef.current = null;
    };

    const onResize = () => {
      refreshBounds();
      const a = currentAnchorRef.current ?? centerAnchor();
      scheduleApply(a.ax, a.ay);
    };

    grid.style.touchAction = "none";
    grid.addEventListener("pointermove", onPointerMove, { passive: true });
    grid.addEventListener("pointerleave", onPointerLeave);
    grid.addEventListener("pointerup", onPointerUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      ro.disconnect();
      grid.removeEventListener("pointermove", onPointerMove);
      grid.removeEventListener("pointerleave", onPointerLeave);
      grid.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (animInstanceRef.current) {
        animInstanceRef.current.pause();
        animInstanceRef.current = null;
      }
      animQueueRef.current = [];
      isRunningRef.current = false;
    };
  }, []);

  function animateGrid(from: number) {
    if (!gridRef.current) return;
    animQueueRef.current.push(from);
    isRunningRef.current = true;

    const resetToCenter = () => {
      const { ax, ay } = centerAnchor();
      scheduleApply(ax, ay);
    };

    const $squares = gridRef.current.querySelectorAll(".square");
    animInstanceRef.current = animate($squares, {
      opacity: [{ to: 1 }, { to: 0 }],
      delay: stagger(200, { grid: [gridWidth, gridHeight], from }),
      onComplete: () => {
        animQueueRef.current.shift();
        if (animQueueRef.current.length === 0) {
          isRunningRef.current = false;
          animInstanceRef.current = null;
          resetToCenter();
        }
      },
    });
  }

  return (
    <div
      //
      ref={rootRef}
      className="animated-squares"
    >
      <div
        style={{ width: containerWidthPx }}
        className="animated-squares__container"
      >
        <div ref={gridRef} className="animated-squares__grid">
          {palette.map((color, i) => (
            <button
              key={i}
              type="button"
              className={`square square-${i + 1}`}
              style={{ backgroundColor: color, opacity: OPACITY_BASE }}
              onClick={() => animateGrid(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedSquares;

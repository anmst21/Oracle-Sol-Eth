import { useRef, useState, useCallback } from "react";

type Bind = {
  onPointerEnter: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onClick: (e: React.MouseEvent) => void;
};

// How long (ms) to suppress synthesized mouse pointer events after a touch tap.
// Mobile browsers emit fake pointerenter/pointerleave with pointerType "mouse"
// right after a touch, which causes the modal to flash open→close before the
// real click fires.
const TOUCH_SUPPRESS_MS = 600;

export function useInfoToggle(): [boolean, React.Dispatch<React.SetStateAction<boolean>>, Bind] {
  const [isOpen, setIsOpen] = useState(false);
  const lastPointerRef = useRef<string>("mouse");
  const lastTouchTimeRef = useRef<number>(0);

  const onPointerEnter = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      lastTouchTimeRef.current = Date.now();
      lastPointerRef.current = "touch";
    } else if (e.pointerType === "mouse") {
      if (Date.now() - lastTouchTimeRef.current >= TOUCH_SUPPRESS_MS) {
        lastPointerRef.current = "mouse";
        setIsOpen(true);
      }
      // Suppress synthesized mouse events — do NOT update lastPointerRef
      // so the pending click still sees "touch" and toggles correctly.
    }
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === "touch") {
      lastPointerRef.current = "touch";
    } else if (e.pointerType === "mouse") {
      if (Date.now() - lastTouchTimeRef.current >= TOUCH_SUPPRESS_MS) {
        lastPointerRef.current = "mouse";
        setIsOpen(false);
      }
    }
  }, []);

  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lastPointerRef.current !== "mouse") {
      setIsOpen((prev) => !prev);
    }
  }, []);

  return [isOpen, setIsOpen, { onPointerEnter, onPointerLeave, onClick }];
}

import { useRef, useState, useCallback } from "react";

type Bind = {
  onPointerEnter: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onClick: (e: React.MouseEvent) => void;
};

export function useInfoToggle(): [boolean, React.Dispatch<React.SetStateAction<boolean>>, Bind] {
  const [isOpen, setIsOpen] = useState(false);
  const lastPointerRef = useRef<string>("mouse");

  const onPointerEnter = useCallback((e: React.PointerEvent) => {
    lastPointerRef.current = e.pointerType;
    if (e.pointerType === "mouse") setIsOpen(true);
  }, []);

  const onPointerLeave = useCallback((e: React.PointerEvent) => {
    lastPointerRef.current = e.pointerType;
    if (e.pointerType === "mouse") setIsOpen(false);
  }, []);

  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (lastPointerRef.current !== "mouse") {
      setIsOpen((prev) => !prev);
    }
  }, []);

  return [isOpen, setIsOpen, { onPointerEnter, onPointerLeave, onClick }];
}

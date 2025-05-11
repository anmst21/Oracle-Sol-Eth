import React from "react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { stringToColor } from "@/helpers/string-to-color";

export enum Theme {
  dark = "dark",
  light = "light",
  legacy = "legacy",
  monochrome = "monochrome",
}

function Icon({ address }: { address: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { resolvedTheme } = useTheme();

  if (!mounted) {
    return null;
  }

  const getShadeColor = () => {
    switch (resolvedTheme) {
      case Theme.dark:
        return "#889697";
      case Theme.legacy:
        return "#8B99A4";
      case Theme.light:
        return "#6F6F6F";
      case Theme.monochrome:
        return "#ffffff";
      default:
        return "#889697";
    }
  };
  const getBgColor = () => {
    switch (resolvedTheme) {
      case Theme.dark:
        return "#0F0E1B";
      case Theme.legacy:
        return "#17101F";
      case Theme.light:
        return "#F7F7F7";
      case Theme.monochrome:
        return "#000000";
      default:
        return "#0F0E1B";
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      style={{
        color: stringToColor(address),
      }}
    >
      <g clipPath="url(#clip0_1965_10748)">
        <rect width="24" height="24" fill="currentColor" rx="12"></rect>
        <circle
          cx="13"
          cy="11"
          r="13"
          fill="url(#paint0_radial_1965_10748)"
        ></circle>
        <circle
          cx="24"
          cy="6"
          r="12"
          fill="url(#paint1_radial_1965_10748)"
        ></circle>
      </g>
      <defs>
        <radialGradient
          id="paint0_radial_1965_10748"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0 13 -13 0 13 11)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.797" stopColor={getBgColor()}></stop>
          <stop offset="1" stopColor={getBgColor()} stopOpacity="0"></stop>
        </radialGradient>
        <radialGradient
          id="paint1_radial_1965_10748"
          cx="0"
          cy="0"
          r="1"
          gradientTransform="matrix(0 12 -12 0 24 6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={getShadeColor()}></stop>
          <stop offset="1" stopColor={getShadeColor()} stopOpacity="0"></stop>
        </radialGradient>
        <clipPath id="clip0_1965_10748">
          <rect width="24" height="24" fill="#fff" rx="12"></rect>
        </clipPath>
      </defs>
    </svg>
  );
}

//F7F7F7

export default Icon;

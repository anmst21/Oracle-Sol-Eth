import React from "react";
import { StakeholderType } from "./types";

type Props = {
  handleItemClick: (type: StakeholderType, id: string) => void;
};

const HoverCircle = ({ handleItemClick }: Props) => {
  return (
    <svg
      width="555"
      height="555"
      viewBox="0 0 540 540"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hover-circle"
    >
      <path
        d="M383.741 25.1004C349.265 9.08648 311.796 0.533146 273.786 0.000171559L273.028 53.9949C303.437 54.4212 333.412 61.2639 360.993 74.0751L383.741 25.1004Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("featured", "base")}
      />

      <path
        d="M481.835 102.564C457.204 71.3969 425.999 46.0484 390.445 28.3272L366.356 76.6565C394.799 90.8335 419.763 111.112 439.468 136.046L481.835 102.564Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("swap", "relay")}
      />

      <path
        d="M532.952 208.683C523.934 169.995 506.49 133.773 481.864 102.601L439.491 136.076C459.192 161.013 473.147 189.991 480.361 220.941L532.952 208.683Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("swap", "moonpay")}
      />

      <path
        d="M534.031 326.433C542.338 287.586 541.97 247.384 532.954 208.696L480.364 220.951C487.576 251.902 487.87 284.064 481.225 315.141L534.031 326.433Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("swap", "privy")}
      />

      <path
        d="M480.274 439.34C505.193 408.402 522.978 372.347 532.361 333.745L479.889 320.991C472.382 351.872 458.154 380.717 438.219 405.467L480.274 439.34Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("coins", "geckoterminal")}
      />

      <path
        d="M388.191 512.731C423.908 495.341 455.348 470.284 480.268 439.347L438.214 405.472C418.278 430.222 393.126 450.268 364.553 464.179L388.191 512.731Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("coins", "dexscreener")}
      />

      <path
        d="M273.77 539.947C313.491 539.393 352.601 530.08 388.31 512.673L364.648 464.133C336.081 478.058 304.793 485.509 273.016 485.953L273.77 539.947Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("coins", "farcasterin")}
      />

      <path
        d="M156.32 514.876C190.788 530.875 228.244 539.418 266.24 539.947L266.992 485.953C236.595 485.529 206.63 478.694 179.056 465.895L156.32 514.876Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("social", "warpcast")}
      />

      <path
        d="M61.3619 441.351C85.4814 470.714 115.527 494.656 149.535 511.61L173.628 463.283C146.422 449.72 122.385 430.566 103.09 407.075L61.3619 441.351Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("creator", "nexus")}
      />

      <path
        d="M6.7777 330.09C15.5361 368.439 32.5681 404.411 56.6821 435.489L99.3457 402.386C80.0545 377.524 66.4289 348.746 59.4222 318.067L6.7777 330.09Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("data", "sim")}
      />

      <path
        d="M6.0223 213.266C-2.25412 251.793 -1.99693 291.665 6.77581 330.082L59.4206 318.06C52.4025 287.327 52.1967 255.429 58.8178 224.607L6.0223 213.266Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("data", "dune")}
      />

      <path
        d="M59.7561 100.57C34.8315 131.504 17.04 167.556 7.65039 206.156L60.1203 218.92C67.632 188.04 81.8652 159.198 101.805 134.451L59.7561 100.57Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("protocol", "balancer")}
      />

      <path
        d="M151.852 27.196C116.131 44.5794 84.6872 69.6308 59.7616 100.563L101.809 134.445C121.75 109.699 146.905 89.6582 175.481 75.7515L151.852 27.196Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("protocol", "uniswap")}
      />

      <path
        d="M266.23 -4.82941e-05C226.571 0.553743 187.52 9.83855 151.855 27.1942L175.484 75.7501C204.016 61.8656 235.257 54.4377 266.984 53.9947L266.23 -4.82941e-05Z"
        fill="red"
        fillOpacity="0"
        onMouseEnter={() => handleItemClick("protocol", "pancakeswap")}
      />
    </svg>
  );
};

export default HoverCircle;

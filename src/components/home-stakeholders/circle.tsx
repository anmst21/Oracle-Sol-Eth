"use client";

import React from "react";
import { ActiveItem, StakeholderType } from "./types";

type Props = {
  activeType: StakeholderType;
  activeItem: ActiveItem;
};

const Circle = ({ activeType, activeItem }: Props) => {
  //   const handleTypeClick = (type: StakeholderType) => {
  //     setActiveType(type);

  //     const defaultItem = STAKEHOLDER_ITEMS[type][0];
  //     setActiveItem(defaultItem ? { type, id: defaultItem } : null);
  //   };

  const isTypeActive = (type: StakeholderType) => activeType === type;

  const isItemActive = (type: StakeholderType, id: string) =>
    activeItem?.type === type && activeItem.id === id;

  return (
    <svg
      width="516"
      height="516"
      viewBox="0 0 516 516"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="stakeholders-circle"
    >
      {/* {featured} */}
      <path
        opacity={isTypeActive("featured") ? 1 : 0.5}
        d="M362.98 30.6045C361.346 33.9944 357.348 35.4787 353.89 33.9944C327.002 22.491 297.929 15.8518 268.715 14.548C264.957 14.3775 262.001 11.2986 262.001 7.53765C262.001 3.53604 265.328 0.326737 269.317 0.50726C300.234 1.89127 331 8.92166 359.452 21.107C363.11 22.6715 364.704 27.0041 362.97 30.5945L362.98 30.6045Z"
        fill={isTypeActive("featured") ? "#AEE900" : "white"}
        fillOpacity="0.05"
        stroke={isTypeActive("featured") ? "#AEE900" : "white"}
        strokeOpacity="0.8"
        strokeMiterlimit="10"
        className="stakeholders-circle__featured"
      />

      <path
        opacity={isItemActive("featured", "base") ? 1 : 0.5}
        d="M313.171 17.0547C315.108 17.0547 316.679 15.4837 316.679 13.5458C316.679 11.6078 315.108 10.0369 313.171 10.0369C311.233 10.0369 309.662 11.6078 309.662 13.5458C309.662 15.4837 311.233 17.0547 313.171 17.0547Z"
        fill={isItemActive("featured", "base") ? "#AEE900" : "white"}
        fillOpacity="0.2"
        stroke={isItemActive("featured", "base") ? "#AEE900" : "white"}
        strokeMiterlimit="10"
        className="stakeholders-circle__featured__base"
      />
      {/* {swap} */}

      <path
        opacity={isTypeActive("swap") ? 1 : 0.5}
        d="M502.904 309.824C499.236 308.982 496.901 305.401 497.582 301.7C516.764 197.157 466.866 93.4767 373.232 43.3112C369.915 41.5361 368.572 37.4743 370.206 34.0845C371.94 30.4941 376.309 29.0499 379.817 30.9353C427.57 56.6198 466.455 97.1874 490.036 146.179C513.607 195.172 521.063 250.883 511.362 304.268C510.651 308.189 506.782 310.717 502.904 309.824Z"
        fill={isTypeActive("swap") ? "#00B0EB" : "white"}
        fillOpacity="0.05"
        stroke={isTypeActive("swap") ? "#00B0EB" : "white"}
        strokeOpacity="0.8"
        strokeMiterlimit="10"
        className="stakeholders-circle__swap"
      />

      <path
        opacity={isItemActive("swap", "relay") ? 1 : 0.5}
        d="M435.435 84.2506C437.373 84.2506 438.943 82.679 438.943 80.7404C438.943 78.8018 437.373 77.2302 435.435 77.2302C433.498 77.2302 431.928 78.8018 431.928 80.7404C431.928 82.679 433.498 84.2506 435.435 84.2506Z"
        fill={
          isItemActive("swap", "relay") || isTypeActive("swap")
            ? "#00B0EB"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("swap", "relay") || isTypeActive("swap")
            ? "#00B0EB"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__swap__relay"
      />
      <path
        opacity={isItemActive("swap", "moonpay") ? 1 : 0.5}
        d="M483.54 151.444C485.478 151.444 487.049 149.873 487.049 147.935C487.049 145.997 485.478 144.427 483.54 144.427C481.602 144.427 480.031 145.997 480.031 147.935C480.031 149.873 481.602 151.444 483.54 151.444Z"
        fill={
          isItemActive("swap", "moonpay") || isTypeActive("swap")
            ? "#00B0EB"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("swap", "moonpay") || isTypeActive("swap")
            ? "#00B0EB"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__swap__moonpay"
      />
      <path
        opacity={isItemActive("swap", "privy") ? 1 : 0.5}
        d="M507.592 236.691C509.53 236.691 511.101 235.12 511.101 233.182C511.101 231.245 509.53 229.674 507.592 229.674C505.654 229.674 504.083 231.245 504.083 233.182C504.083 235.12 505.654 236.691 507.592 236.691Z"
        fill={
          isItemActive("swap", "privy") || isTypeActive("swap")
            ? "#00B0EB"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("swap", "privy") || isTypeActive("swap")
            ? "#00B0EB"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__swap__privy"
      />

      {/* {coins} */}

      <path
        opacity={isTypeActive("coins") ? 1 : 0.5}
        d="M501.119 317.649C504.998 318.542 507.383 322.483 506.331 326.334C491.929 378.646 461.063 425.612 418.57 459.51C376.088 493.419 323.464 513.076 269.297 515.493C265.318 515.673 262.001 512.464 262.001 508.472C262.001 504.711 264.967 501.633 268.725 501.472C374.835 496.919 464.74 425.171 492.791 322.654C493.783 319.023 497.441 316.817 501.109 317.649H501.119Z"
        fill={isTypeActive("coins") ? "#00EBB0" : "white"}
        fillOpacity="0.05"
        stroke={isTypeActive("coins") ? "#00EBB0" : "white"}
        strokeOpacity="0.8"
        strokeMiterlimit="10"
        className="stakeholders-circle__coins"
      />

      <path
        opacity={isItemActive("coins", "geckoterminal") ? 1 : 0.5}
        d="M468.507 397.156C470.445 397.156 472.016 395.585 472.016 393.648C472.016 391.71 470.445 390.139 468.507 390.139C466.57 390.139 464.999 391.71 464.999 393.648C464.999 395.585 466.57 397.156 468.507 397.156Z"
        fill={
          isItemActive("coins", "geckoterminal") || isTypeActive("coins")
            ? "#00EBB0"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("coins", "geckoterminal") || isTypeActive("coins")
            ? "#00EBB0"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__coins__geckoterminal"
      />
      <path
        opacity={isItemActive("coins", "dexscreener") ? 1 : 0.5}
        d="M412.386 459.338C414.323 459.338 415.893 457.767 415.893 455.828C415.893 453.89 414.323 452.318 412.386 452.318C410.448 452.318 408.878 453.89 408.878 455.828C408.878 457.767 410.448 459.338 412.386 459.338Z"
        fill={
          isItemActive("coins", "dexscreener") || isTypeActive("coins")
            ? "#00EBB0"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("coins", "dexscreener") || isTypeActive("coins")
            ? "#00EBB0"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__coins__dexscreener"
      />
      <path
        opacity={isItemActive("coins", "farcasterin") ? 1 : 0.5}
        d="M340.229 498.452C342.166 498.452 343.737 496.88 343.737 494.942C343.737 493.003 342.166 491.431 340.229 491.431C338.292 491.431 336.721 493.003 336.721 494.942C336.721 496.88 338.292 498.452 340.229 498.452Z"
        fill={
          isItemActive("coins", "farcasterin") || isTypeActive("coins")
            ? "#00EBB0"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("coins", "farcasterin") || isTypeActive("coins")
            ? "#00EBB0"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__coins__farcasterin"
      />

      {/* {social} */}

      <path
        opacity={isTypeActive("social") ? 1 : 0.5}
        d="M253.991 508.461C253.991 512.453 250.663 515.662 246.675 515.481C215.758 514.097 184.981 507.067 156.529 494.882C152.871 493.317 151.278 488.985 153.012 485.394C154.645 482.004 158.644 480.52 162.091 481.994C188.97 493.498 218.053 500.137 247.266 501.451C251.014 501.621 253.981 504.7 253.981 508.451L253.991 508.461Z"
        fill="#FFFFFF"
        fillOpacity="0.05"
        stroke="#FFFFFF"
        strokeOpacity="0.8"
        strokeMiterlimit="10"
        className="stakeholders-circle__social"
      />

      <path
        opacity={isItemActive("social", "warpcast") ? 1 : 0.5}
        d="M200.927 505.471C202.865 505.471 204.436 503.9 204.436 501.962C204.436 500.024 202.865 498.453 200.927 498.453C198.989 498.453 197.418 500.024 197.418 501.962C197.418 503.9 198.989 505.471 200.927 505.471Z"
        fill="#FFFFFF"
        fillOpacity="0.2"
        stroke="#FFFFFF"
        strokeMiterlimit="10"
        className="stakeholders-circle__social__warpcast"
      />

      {/* {creator} */}

      <path
        opacity={isTypeActive("creator") ? 1 : 0.5}
        d="M145.789 481.913C144.065 485.504 139.685 486.958 136.178 485.072C108.919 470.41 84.2351 450.713 63.871 427.375C61.2553 424.376 61.6963 419.783 64.813 417.296C67.7494 414.949 71.9986 415.35 74.474 418.178C93.7057 440.212 117.026 458.816 142.772 472.686C146.079 474.472 147.412 478.523 145.779 481.913H145.789Z"
        fill={isTypeActive("creator") ? "#EB00B0" : "white"}
        fillOpacity="0.05"
        stroke={isTypeActive("creator") ? "#EB00B0" : "white"}
        strokeOpacity="0.8"
        strokeMiterlimit="10"
        className="stakeholders-circle__creator"
      />

      <path
        opacity={isItemActive("creator", "nexus") ? 1 : 0.5}
        d="M101.712 457.331C103.65 457.331 105.221 455.76 105.221 453.822C105.221 451.884 103.65 450.313 101.712 450.313C99.7739 450.313 98.2029 451.884 98.2029 453.822C98.2029 455.76 99.7739 457.331 101.712 457.331Z"
        fill={isItemActive("creator", "nexus") ? "#EB00B0" : "white"}
        fillOpacity="0.2"
        stroke={isItemActive("creator", "nexus") ? "#EB00B0" : "white"}
        strokeMiterlimit="10"
        className="stakeholders-circle__creator__nexus"
      />

      {/* {data} */}

      <path
        opacity={isTypeActive("data") ? 1 : 0.5}
        d="M59.8227 411.03C56.7059 413.517 52.136 412.926 49.8009 409.706C29.3867 381.605 14.6347 349.201 6.91793 315.353C-0.798807 281.504 -1.56046 245.921 4.65302 211.732C5.36456 207.811 9.22293 205.294 13.1013 206.186C16.7693 207.019 19.1044 210.609 18.4329 214.32C6.37676 280.191 21.68 347.285 61.1055 401.402C63.3203 404.451 62.7791 408.693 59.8327 411.04L59.8227 411.03Z"
        fill={isTypeActive("data") ? "#EB8900" : "white"}
        fillOpacity="0.05"
        stroke={isTypeActive("data") ? "#EB8900" : "white"}
        strokeOpacity="0.8"
        strokeMiterlimit="10"
        className="stakeholders-circle__data"
      />

      <path
        opacity={isItemActive("data", "dune") ? 1 : 0.5}
        d="M7.50736 262.768C9.44456 262.768 11.015 261.197 11.015 259.258C11.015 257.319 9.44456 255.748 7.50736 255.748C5.57017 255.748 3.99976 257.319 3.99976 259.258C3.99976 261.197 5.57017 262.768 7.50736 262.768Z"
        fill={
          isItemActive("data", "dune") || isTypeActive("data")
            ? "#EB8900"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("data", "dune") || isTypeActive("data")
            ? "#EB8900"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__data__dune"
      />
      <path
        opacity={isItemActive("data", "sim") ? 1 : 0.5}
        d="M32.5619 370.078C34.4998 370.078 36.0708 368.507 36.0708 366.569C36.0708 364.631 34.4998 363.06 32.5619 363.06C30.624 363.06 29.053 364.631 29.053 366.569C29.053 368.507 30.624 370.078 32.5619 370.078Z"
        fill={
          isItemActive("data", "sim") || isTypeActive("data")
            ? "#EB8900"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("data", "sim") || isTypeActive("data")
            ? "#EB8900"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__data__sim"
      />

      {/* {protocol} */}

      <path
        opacity={isTypeActive("protocol") ? 1 : 0.5}
        d="M253.981 7.52931C253.981 11.2902 251.014 14.3691 247.256 14.5296C141.146 19.0928 51.2409 90.8409 23.2 193.358C22.2079 196.989 18.55 199.205 14.882 198.363C11.0036 197.47 8.61841 193.529 9.67069 189.677C24.0719 137.366 54.9389 90.3996 97.421 56.5013C139.903 22.593 192.517 2.93599 246.685 0.518979C250.663 0.338456 253.981 3.54776 253.981 7.53934V7.52931Z"
        fill={isTypeActive("protocol") ? "#EB003B" : "white"}
        fillOpacity="0.05"
        stroke={isTypeActive("protocol") ? "#EB003B" : "white"}
        strokeOpacity="0.8"
        strokeMiterlimit="10"
        className="stakeholders-circle__protocol"
      />

      <path
        opacity={isItemActive("protocol", "balancer") ? 1 : 0.5}
        d="M45.5899 128.377C47.5279 128.377 49.0988 126.806 49.0988 124.868C49.0988 122.93 47.5279 121.359 45.5899 121.359C43.652 121.359 42.0811 122.93 42.0811 124.868C42.0811 126.806 43.652 128.377 45.5899 128.377Z"
        fill={
          isItemActive("protocol", "balancer") || isTypeActive("protocol")
            ? "#EB003B"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("protocol", "balancer") || isTypeActive("protocol")
            ? "#EB003B"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__protocol__balancer"
      />
      <path
        opacity={isItemActive("protocol", "uniswap") ? 1 : 0.5}
        d="M101.712 65.1941C103.65 65.1941 105.221 63.6231 105.221 61.6852C105.221 59.7473 103.65 58.1763 101.712 58.1763C99.7739 58.1763 98.2029 59.7473 98.2029 61.6852C98.2029 63.6231 99.7739 65.1941 101.712 65.1941Z"
        fill={
          isItemActive("protocol", "uniswap") || isTypeActive("protocol")
            ? "#EB003B"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("protocol", "uniswap") || isTypeActive("protocol")
            ? "#EB003B"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__protocol__uniswap"
      />
      <path
        opacity={isItemActive("protocol", "pancakeswap") ? 1 : 0.5}
        d="M173.868 25.0792C175.805 25.0792 177.376 23.5076 177.376 21.569C177.376 19.6304 175.805 18.0588 173.868 18.0588C171.931 18.0588 170.361 19.6304 170.361 21.569C170.361 23.5076 171.931 25.0792 173.868 25.0792Z"
        fill={
          isItemActive("protocol", "pancakeswap") || isTypeActive("protocol")
            ? "#EB003B"
            : "white"
        }
        fillOpacity="0.2"
        stroke={
          isItemActive("protocol", "pancakeswap") || isTypeActive("protocol")
            ? "#EB003B"
            : "white"
        }
        strokeMiterlimit="10"
        className="stakeholders-circle__protocol__pancakeswap"
      />
    </svg>
  );
};

export default Circle;

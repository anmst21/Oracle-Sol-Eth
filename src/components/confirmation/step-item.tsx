import React from "react";
import { StepUri, StepCheck } from "../icons";
import Image from "next/image";
import { truncateAddress } from "@/helpers/truncate-address";
import Link from "next/link";
import Lottie from "lottie-react";
import { iconProps } from "../shared/animation";
import animationData from "../icons/loader-animation.json";
import { AnimatePresence, motion } from "motion/react";

type Props = {
  type: "approve" | "deposit" | "fill";
  isLoading: boolean;
  iconUri?: string;
  isComplete: boolean;
  txAddress?: string;
  chainName?: string;
  explorerUri?: string;
  isSend?: boolean;
};

const StepItem = ({
  isLoading,
  iconUri,
  type,
  isComplete,
  txAddress,
  chainName,
  isSend,
  explorerUri,
}: Props) => {
  return (
    <div className="confirmtion-step-item">
      <div className="confirmtion-step-item__icon">
        <AnimatePresence initial={false} mode="popLayout">
          {isLoading && !isComplete && (
            <motion.div
              key="loading"
              {...iconProps}
              style={{
                display: "flex",
                overflow: "hidden",
                borderRadius: 100,
              }}
            >
              <Lottie
                animationData={animationData}
                loop
                autoplay
                style={{ width: 24, height: 24 }}
              />
            </motion.div>
          )}
          {iconUri && !isLoading && !isComplete && (
            <motion.div
              key="icon"
              {...iconProps}
              style={{
                display: "flex",
                overflow: "hidden",
                borderRadius: 100,
              }}
            >
              <Image
                width={26}
                height={26}
                src={iconUri}
                alt={`${type} token`}
              />
            </motion.div>
          )}
          {isComplete && (
            <motion.div
              key="complete"
              {...iconProps}
              style={{
                display: "flex",
                overflow: "hidden",
                borderRadius: 100,
              }}
            >
              <StepCheck />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="confirmtion-step-item__meta">
        <div className="confirmtion-step-item__meta__top">
          <span>
            {type === "approve" && "Approve Token"}
            {type === "deposit" && `Confirm ${isSend ? "Send" : "Swap"}`}
            {type === "fill" &&
              `Oracle fills your order on ${chainName || "chain"}`}
          </span>

          {(type === "approve" || type === "deposit") && (
            <div className="confirmtion-step-item__meta__top__badge">
              In Wallet
            </div>
          )}
        </div>
        {txAddress && explorerUri && (
          <Link
            target="_blank"
            href={explorerUri + "/tx/" + txAddress}
            className="confirmtion-step-item__meta__bottom"
          >
            {truncateAddress(txAddress, 8)}
            <StepUri />
          </Link>
        )}
      </div>
    </div>
  );
};

export default StepItem;

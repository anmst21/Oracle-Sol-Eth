"use client";

import React, { useCallback, useState } from "react";
import {
  PrivyLogo,
  FarcasterLogo,
  PfpPlaceholder,
  ArrowSmall,
  FeedProfile,
  FeedUnlink,
} from "../icons";
import { usePrivy } from "@privy-io/react-auth";
import { useFeed } from "@/context/FeedProvider";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import Image from "next/image";
import { slidingTextAnimation } from "../swap/animation";
import { useActiveWallet } from "@/context/ActiveWalletContext";

const FeedHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { push } = useRouter();
  const { isFollowing, setIsFollowing } = useFeed();

  const { user, ready, linkFarcaster, unlinkFarcaster, login } = usePrivy();
  const onFeedChange = useCallback(
    (value: boolean) => {
      setIsFollowing(value);
      if (value) {
        push("/feed/following");
      } else {
        push("/feed/featured");
      }
    },
    [setIsFollowing, push]
  );

  const isNotConnected = (ready && !user) || !ready;
  const isNotLoggedInFarcaster = ready && user && !user.farcaster;
  const isShowUser = ready && user?.farcaster;

  const dynamicKey = isNotConnected
    ? "privy"
    : isNotLoggedInFarcaster
    ? "farcaster"
    : isShowUser
    ? "user"
    : "default";

  const onLogin = () => {
    if (isNotConnected) login();
    if (isNotLoggedInFarcaster) linkFarcaster();
    if (isShowUser) setIsModalOpen(!isModalOpen);
  };

  const { activeWallet } = useActiveWallet();

  const onProfile = () => (
    push("/user/" + activeWallet?.address), setIsModalOpen(false)
  );
  const onLogout = () => (
    user?.farcaster?.fid && unlinkFarcaster(user?.farcaster?.fid),
    setIsModalOpen(false)
  );

  return (
    <div className="feed-header">
      <div className="slippage-modal__button">
        <button
          className={classNames({
            "slippage-modal__button--active": !isFollowing,
          })}
          onClick={() => onFeedChange(false)}
          key={"feed-featured"}
        >
          Featured
          {!isFollowing ? (
            <motion.div layoutId="underline" className="underline" />
          ) : null}
        </button>
        {user?.farcaster && (
          <button
            key={"feed-following"}
            className={classNames({
              "slippage-modal__button--active": isFollowing,
            })}
            onClick={() => onFeedChange(true)}
          >
            Following
            {isFollowing ? (
              <motion.div layoutId="underline" className="underline" />
            ) : null}
          </button>
        )}
      </div>
      <div
        onMouseLeave={() => {
          if (isModalOpen) setIsModalOpen(false);
        }}
        className="feed-action-button__container"
      >
        <button onClick={onLogin} className="feed-action-button">
          <div className="feed-action-button__logo">
            <motion.div
              key={dynamicKey}
              {...slidingTextAnimation}
              className="feed-action-button__logo__motion"
            >
              {isNotConnected && <PrivyLogo />}
              {isNotLoggedInFarcaster && <FarcasterLogo />}
              {isShowUser && (
                <div className="feed-action-button__pfp">
                  {user?.farcaster?.pfp ? (
                    <Image
                      width={20}
                      height={20}
                      src={user?.farcaster?.pfp}
                      alt="User's pfp"
                    />
                  ) : (
                    <PfpPlaceholder />
                  )}
                </div>
              )}
            </motion.div>
          </div>
          <div className="feed-action-button__text">
            <motion.span key={dynamicKey} {...slidingTextAnimation}>
              {isNotConnected && "Login"}
              {isNotLoggedInFarcaster && "Link"}
              {isShowUser && "@" + user?.farcaster?.username}
            </motion.span>
            <AnimatePresence mode="wait">
              {!isShowUser && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className={classNames("recipient-window__address__arrow", {
                    "recipient-window__address__arrow--inactive": !ready,
                  })}
                >
                  <ArrowSmall />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
        <AnimatePresence mode="wait">
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="slippage-modal__wrapper"
              id="feed-modal-root"
            >
              <div className="slippage-modal__container">
                <button onClick={onProfile}>
                  <FeedProfile />
                  <span>Profile</span>
                </button>
                <button onClick={onLogout}>
                  <FeedUnlink />
                  <span>Unlink</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedHeader;

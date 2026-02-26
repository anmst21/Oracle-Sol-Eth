"use client";

import {
  BlogFarcaster,
  BlogX,
  BlogLinkedIn,
  BlogShare,
  BlogBack,
} from "@/components/icons";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type Props = {
  slug: string;
  name: string;
  subheader: string;
};

const PostHeader = ({ slug, name, subheader }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { push } = useRouter();

  const postUrl = `https://oracleswap.app/blog/${slug}`;

  const twitterShareUrl = `https://x.com/intent/tweet?url=${encodeURIComponent(
    postUrl
  )}&text=${encodeURIComponent(name)}`;
  const linkedInShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    postUrl
  )}&title=${encodeURIComponent(name)}&summary=${encodeURIComponent(subheader)}`;
  const farcasterShareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
    `Check out "${name}": 
    ${postUrl}`
  )}`;

  const shareBtns = [
    { text: "Twitter/X", uri: twitterShareUrl, icon: <BlogX /> },
    { text: "Farcaster", uri: farcasterShareUrl, icon: <BlogFarcaster /> },

    { text: "LinkedIn", uri: linkedInShareUrl, icon: <BlogLinkedIn /> },
  ];

  return (
    <div className="blog-header posts-header">
      <div className="blog-mini-divider" />

      <button onClick={() => push("/blog")} className="blog-header__back">
        <BlogBack />
        <span>All articles</span>
      </button>
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }
        className="blog-header__up"
      >
        <BlogBack />
      </button>

      <div className="blog-divider" />
      <div
        onMouseLeave={() => {
          if (isOpen) setIsOpen(false);
        }}
        onClick={() => setIsOpen(!isOpen)}
        className="blog-header__share"
      >
        <BlogShare />
        <span>Share</span>
        <AnimatePresence mode="wait">
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="slippage-modal__wrapper"
              id="modal-root"
            >
              <motion.div
                className="slippage-modal__container"
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="share-btns">
                  {shareBtns.map((btn) => {
                    return (
                      <Link target="_blank" key={btn.text} href={btn.uri}>
                        {btn.text}
                        {btn.icon}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PostHeader;

import React from "react";
import { HexChain, SwapArrow, UserQuestion } from "../icons";
import classNames from "classnames";
import { getIconUri } from "@/helpers/get-icon-uri";
import { AnimatePresence, motion } from "motion/react";
import { slidingTextAnimation } from "../shared/animation";
import { truncateAddress } from "@/helpers/truncate-address";
import Image from "next/image";
import { UnifiedToken } from "@/types/coin-types";
import { ModalMode } from "@/types/modal-mode";

type Props = {
  openModalCallback: (opts: {
    mode: ModalMode;
    onSelect: (t: UnifiedToken) => void;
  }) => void;
  token: UnifiedToken | null;
  mode: "buy" | "sell";
  tokenBalance: string;
  setToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
};

const TokenButton = ({
  openModalCallback,
  token,
  mode,
  tokenBalance,
  setToken,
}: Props) => {
  return (
    <button
      onClick={() => openModalCallback({ mode: "buy", onSelect: setToken })}
      className="token-to-buy__token"
    >
      <div className="token-to-buy__token__icon">
        {!token ? (
          <HexChain width={32} question />
        ) : (
          <HexChain
            key={token.name}
            width={32}
            uri={token.chainId ? getIconUri(token.chainId) : undefined}
          />
        )}
        <div
          className={classNames("user-placeholder", {
            "user-placeholder--empty": !token,
          })}
        >
          {token && token.logo ? (
            <Image
              src={token.logo}
              width={30}
              height={30}
              alt={`${mode} token input`}
            />
          ) : (
            <UserQuestion />
          )}
        </div>
      </div>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={tokenBalance ?? "balances"}
          {...slidingTextAnimation}
          className="token-to-buy__token__text"
        >
          <h4>{token ? token.symbol : "Select"}</h4>
          <span>{token ? truncateAddress(token.address) : "Token"}</span>
        </motion.div>
      </AnimatePresence>
      <div className="token-to-buy__token__arrow">
        <SwapArrow />
      </div>
    </button>
  );
};

export default TokenButton;

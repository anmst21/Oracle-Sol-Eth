import { RelayChainFetch } from "@/types/relay-chain";
import classNames from "classnames";
import { motion } from "motion/react";
import { HexChain } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import { parseDateHistory } from "@/helpers/parse-date-history";

type Props = {
  modalChain: RelayChainFetch;
  isLeft: boolean;
  callback: () => void;
  value: number | undefined;
  date: string;
};

const LineModal = ({ modalChain, isLeft, callback, value, date }: Props) => {
  const [day, monthYear] = parseDateHistory(date);
  return (
    <motion.div
      onClick={callback}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      // id="modal-root"
      className={classNames("slippage-modal__wrapper line-modal", {
        "line-modal--left": isLeft,
        "line-modal--right": !isLeft,
      })}
    >
      <div className="slippage-modal__container">
        <div className="line-modal__line">
          <div className="line-modal__line__header">
            <span>Chain</span>
          </div>
          <div className="line-modal__line__value">
            {modalChain.id && (
              <HexChain width={14} uri={getIconUri(modalChain.id)} />
            )}
            {modalChain.displayName}
          </div>
        </div>
        <div className="line-modal__line">
          <div className="line-modal__line__header">
            <span>Value</span>
          </div>
          <div className="line-modal__line__value">
            <span>
              <span>$ </span>
              {(value || 0).toFixed(2)}
            </span>
          </div>
        </div>
        <div className="line-modal__line">
          <div className="line-modal__line__header">
            <span>Date</span>
          </div>
          <div className="line-modal__line__value">{day + " " + monthYear}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default LineModal;

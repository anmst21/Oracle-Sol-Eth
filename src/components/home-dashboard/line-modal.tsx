import { RelayChainFetch } from "@/types/relay-chain";
import { motion } from "motion/react";
import { HexChain } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import { parseDateHistory } from "@/helpers/parse-date-history";
import { Portal } from "../slippage-modal/portal";

type Props = {
  modalChain: RelayChainFetch;
  isLeft: boolean;
  callback: () => void;
  value: number | undefined;
  date: string;
  rect: DOMRect | null;
};

const LineModal = ({ modalChain, isLeft, callback, value, date, rect }: Props) => {
  const [day, monthYear] = parseDateHistory(date);

  const wrapperStyle = rect
    ? ({
        position: "fixed" as const,
        bottom: window.innerHeight - rect.bottom,
        ...(isLeft
          ? { left: rect.right + 8 }
          : { right: window.innerWidth - rect.left + 8 }),
        zIndex: 10,
      })
    : {};

  return (
    <Portal>
      <motion.div
        onClick={callback}
        style={wrapperStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="slippage-modal__wrapper line-modal"
      >
        <motion.div
          className="slippage-modal__container"
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(15px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          transition={{ duration: 0.2 }}
        >
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
        </motion.div>
      </motion.div>
    </Portal>
  );
};

export default LineModal;

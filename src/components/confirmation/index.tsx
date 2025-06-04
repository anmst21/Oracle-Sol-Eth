import { ProgressData } from "@reservoir0x/relay-sdk";
import React, { useEffect, useMemo, useState } from "react";
import { CheckLg, InputCross, SwapZap, DashedCircle } from "../icons";
import TokenItem from "./token-item";
import StepItem from "./step-item";
import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import StepDivider from "./step-divider";
import { getIconUri } from "@/helpers/get-icon-uri";
import Lottie from "lottie-react";
import { Tx } from "./types";
import animationData from "../icons/loader-animation.json";
import { useRouter } from "next/navigation";
import TxBlock from "./tx-block";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import { iconProps } from "./animation";
import { slidingTextAnimation } from "../swap/animation";

type Props = {
  progress: ProgressData;
  buyTokenLogo: string | undefined;
  sellTokenLogo: string | undefined;
  clearProgressState: () => void;
};

function Confirmation({
  progress,
  buyTokenLogo,
  sellTokenLogo,
  clearProgressState,
}: Props) {
  const { details, steps, currentStep, currentStepItem, txHashes } = progress;

  const { chains } = useRelayChains();

  const toChainName = useMemo(
    () =>
      chains?.find(
        (chain) => chain.id === details?.currencyOut?.currency?.chainId
      )?.displayName,
    [chains, details?.currencyOut?.currency?.chainId]
  );

  const fromChainExplorerUri = useMemo(
    () =>
      chains?.find(
        (chain) => chain.id === details?.currencyIn?.currency?.chainId
      )?.explorerUrl,
    [chains, details?.currencyIn?.currency?.chainId]
  );

  const confirmationStep = useMemo(
    () => steps.find((step) => step.id === "approve"),
    [steps]
  );
  const isLoadingTransaction =
    ((currentStep?.id === "swap" ||
      currentStep?.id === "send" ||
      currentStep?.id === "deposit") &&
      currentStepItem?.progressState === "validating" &&
      currentStepItem?.status === "incomplete") ||
    (currentStepItem?.progressState === "complete" &&
      currentStepItem?.status === "complete");

  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSecs, setElapsedSecs] = useState<number | null>(null);

  const [showElapsed, setShowElapsed] = useState<boolean>(false);

  useEffect(() => {
    if (isLoadingTransaction && startTime === null) {
      setStartTime(Date.now());
      setElapsedSecs(null);
      setShowElapsed(false);
    }
  }, [isLoadingTransaction, startTime]);

  useEffect(() => {
    if (!currentStep && startTime !== null) {
      const endTime = Date.now();
      const secs = Math.floor((endTime - startTime) / 1000);
      setElapsedSecs(secs);
      setStartTime(null);
    }
  }, [currentStep, startTime]);

  useEffect(() => {
    if (elapsedSecs !== null) {
      const timer = setTimeout(() => {
        setShowElapsed(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [elapsedSecs]);

  console.log("elapsed", elapsedSecs, showElapsed);

  const relayTxHash = useMemo(
    () =>
      steps.find(
        (step) =>
          step?.id === "swap" || step?.id === "send" || step?.id === "deposit"
      )?.requestId,
    [steps]
  );
  const groupedByChain: Record<number, Tx[]> = useMemo(() => {
    if (!txHashes) return {};

    return txHashes.reduce<Record<number, Tx[]>>((acc, tx) => {
      if (!acc[tx.chainId]) {
        acc[tx.chainId] = [];
      }
      acc[tx.chainId].push(tx);
      return acc;
    }, {});
  }, [txHashes]);

  const groups: Tx[][] = useMemo(() => {
    return Object.values(groupedByChain);
  }, [groupedByChain]);

  const { push } = useRouter();

  return (
    <div onClick={clearProgressState} className="confirmation__container">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="confirmation__wrapper"
      >
        <div className="confirmation">
          <div className="confirmation__header">
            <div className="confirmation__header__status">STATUS</div>
            <div className="confirmation__header__details">
              <span>Transaction details</span>
              <button onClick={clearProgressState}>
                <InputCross />
              </button>
            </div>
          </div>
          <div className="confirmation__status__wrapper">
            <div className="confirmation__status">
              <div className="confirmation__status__circle">
                <AnimatePresence initial={false} mode="popLayout">
                  {showElapsed ? (
                    <motion.div
                      key="dashed-circle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="dashed-circle"
                    >
                      <DashedCircle />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="regular-circle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="regular-circle"
                    />
                  )}
                </AnimatePresence>

                <AnimatePresence initial={false} mode="popLayout">
                  {currentStep ? (
                    <motion.div
                      key="icon-loader"
                      {...iconProps}
                      style={{
                        display: "flex",
                      }}
                    >
                      <Lottie
                        animationData={animationData}
                        loop={true}
                        autoplay={true}
                        style={{
                          width: 42,
                          height: 42,
                        }}
                      />
                    </motion.div>
                  ) : showElapsed ? (
                    <motion.div
                      key="icon-seconds"
                      {...iconProps}
                      style={{
                        display: "flex",
                      }}
                    >
                      <span>{elapsedSecs}s</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="icon-check"
                      {...iconProps}
                      style={{
                        display: "flex",
                      }}
                    >
                      <CheckLg />
                    </motion.div>
                  )}
                </AnimatePresence>
                <AnimatePresence mode="popLayout">
                  {!currentStep && (
                    <motion.div
                      key={showElapsed ? "elapsed-zap" : "swap-zap"}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className={classNames("zap-container", {
                        "zap-container--elapsed": showElapsed,
                      })}
                    >
                      <SwapZap />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <AnimatePresence initial={false} mode="popLayout">
                {!isLoadingTransaction && currentStep && (
                  <motion.h4
                    key="text-action"
                    {...slidingTextAnimation}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    Waiting for action
                  </motion.h4>
                )}
                {isLoadingTransaction && currentStep && (
                  <motion.h4
                    key="text-processing"
                    {...slidingTextAnimation}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    Processing
                  </motion.h4>
                )}
                {!currentStep && (
                  <motion.h4 key="text-success" {...slidingTextAnimation}>
                    Successfully swapped
                  </motion.h4>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="confirmation__tokens">
            {details?.currencyIn && (
              <TokenItem
                tokenName={details.currencyIn.currency?.name}
                ticker={details.currencyIn.currency?.symbol}
                tokenUri={sellTokenLogo}
                chainId={details.currencyIn.currency?.chainId}
                amount={details?.currencyIn?.amountFormatted}
                type="from"
              />
            )}
            {details?.currencyOut && (
              <TokenItem
                tokenName={details.currencyOut.currency?.name}
                ticker={details.currencyOut.currency?.symbol}
                tokenUri={buyTokenLogo}
                chainId={details.currencyOut.currency?.chainId}
                amount={details?.currencyOut?.amountFormatted}
                type="to"
              />
            )}
          </div>

          <motion.div
            layout // <-- this tells Framer Motion to animate height
            style={{ display: "flex", overflow: "hidden", width: "100%" }} // <-- hide overflow while animating
            //   className="slippage-modal__body"
          >
            <AnimatePresence initial={false} mode="wait">
              {currentStep ? (
                <motion.div
                  key="progress"
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="confirmation__progress"
                >
                  {confirmationStep && (
                    <>
                      <StepItem
                        isLoading={
                          currentStep?.id === "approve" &&
                          currentStepItem?.status === "incomplete"
                        }
                        isComplete={
                          (currentStep?.id === "approve" &&
                            currentStepItem?.status === "complete") ||
                          currentStep?.id !== "approve" ||
                          !currentStep
                        }
                        type={"approve"}
                        txAddress={
                          confirmationStep.items.length &&
                          confirmationStep.items[0].txHashes?.length
                            ? confirmationStep.items[0].txHashes[0].txHash
                            : ""
                        }
                        explorerUri={fromChainExplorerUri}
                        iconUri={
                          details?.currencyIn?.currency?.chainId
                            ? getIconUri(details?.currencyIn?.currency?.chainId)
                            : ""
                        }
                      />
                      <StepDivider />
                    </>
                  )}

                  <StepItem
                    isLoading={
                      (currentStep?.id === "swap" ||
                        currentStep?.id === "send" ||
                        currentStep?.id === "deposit") &&
                      currentStepItem?.progressState === "confirming" &&
                      currentStepItem?.status === "incomplete"
                    }
                    isComplete={isLoadingTransaction || !currentStep}
                    isSend={currentStep?.id === "send"}
                    type={"deposit"}
                    iconUri={sellTokenLogo}
                  />
                  <StepDivider />

                  <StepItem
                    isLoading={isLoadingTransaction}
                    isComplete={!currentStep}
                    type="fill"
                    iconUri={
                      details?.currencyOut?.currency?.chainId
                        ? getIconUri(details?.currencyOut?.currency?.chainId)
                        : ""
                    }
                    chainName={toChainName}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="overview"
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="confirmation__success"
                >
                  <div className="confirmation__overview">
                    <div className="confirmation__overview__header">
                      <span>Overview:</span>
                    </div>

                    {groups &&
                      groups.map((group, i) => (
                        <TxBlock chains={chains} transactions={group} key={i} />
                      ))}
                  </div>
                  <div className="confirmation__buttons">
                    <button
                      disabled={!relayTxHash}
                      onClick={() => push("/transaction/" + relayTxHash)}
                      className="confirmation__buttons__details"
                    >
                      View Details
                    </button>
                    <button
                      onClick={clearProgressState}
                      className="confirmation__buttons__cta"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Confirmation;

import React from "react";
import GreenDot from "../green-dot";
import ClockInfo from "../icons/ClockInfo";
import SkeletonLoaderWrapper from "../skeleton";

type Props = {
  relayFeeValue: string | undefined;
  appFeeValue: string | undefined;
  appFeeTicker: string | undefined;
  timeEstimate?: number | undefined;
  isLoading: boolean;
};

const TransactionTime = ({
  appFeeValue,
  relayFeeValue,
  appFeeTicker,
  timeEstimate,
  isLoading,
}: Props) => {
  const [intRelay, decRelay] = String(relayFeeValue).split(".");
  const [intApp, decApp] = String(appFeeValue).split(".");

  return (
    <div className="transaction-time">
      {timeEstimate && (
        <div className="transaction-route__route">
          <div className="transaction-route__key">
            <span>Time</span>
          </div>
          <SkeletonLoaderWrapper
            radius={6}
            height={30}
            width={"auto"}
            isLoading={isLoading}
            flex={isLoading}
          >
            <div className="transaction-route__route__relay">
              <ClockInfo />
            </div>
            <div className="transaction-route__value__name">
              ~{timeEstimate}
            </div>
            <div className="transaction-route__value__name transaction-route__value__name--green">
              Sec
            </div>
          </SkeletonLoaderWrapper>
        </div>
      )}
      <div className="transaction-route__route">
        <div className="transaction-route__key">
          <span>Relay Fee</span>
        </div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoading}
          flex={isLoading}
        >
          <div className="transaction-route__value__name">
            <GreenDot int={intRelay} dec={decRelay} />
          </div>
          <div className="transaction-route__value__name transaction-route__value__name--green">
            {appFeeTicker}
          </div>
        </SkeletonLoaderWrapper>
      </div>
      <div className="transaction-route__route">
        <div className="transaction-route__key">
          <span>App Fee</span>
        </div>
        <SkeletonLoaderWrapper
          radius={6}
          height={30}
          width={"auto"}
          isLoading={isLoading}
          flex={isLoading}
        >
          <div className="transaction-route__value__name">
            <GreenDot int={intApp} dec={decApp} />
          </div>
          <div className="transaction-route__value__name transaction-route__value__name--green">
            {appFeeTicker}
          </div>
        </SkeletonLoaderWrapper>
      </div>
    </div>
  );
};

export default TransactionTime;

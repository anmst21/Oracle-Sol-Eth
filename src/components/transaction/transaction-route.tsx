import React from "react";
import { relayLogoUri } from "@/helpers/relay-logo-uri";
import Image from "next/image";
import GreenDot from "../green-dot";
import SkeletonLoaderWrapper from "../skeleton";

type Props = {
  depositChainName: string | undefined;
  depositGasValue: string | undefined;
  depositCurrencyTicker: string | undefined;
  fillChainName: string | undefined;
  fillGasValue: string | undefined;
  fillCurrencyTicker: string | undefined;
  isLoading: boolean;
  hideFill: boolean;
};

const TransactionRoute = ({
  depositChainName,
  depositCurrencyTicker,
  depositGasValue,
  fillChainName,
  fillCurrencyTicker,
  fillGasValue,
  isLoading,
  hideFill,
}: Props) => {
  const [intDeposit, decDeposit] = String(depositGasValue).split(".");
  const [intFill, decFill] = String(fillGasValue).split(".");

  return (
    <div className="transaction-route">
      <div className="transaction-route__route">
        <div className="transaction-route__key">
          <span>Route</span>
        </div>
        <div className="transaction-route__route__relay">
          <Image width={16} height={16} src={relayLogoUri} alt="Relay logo" />
        </div>
        <div className="transaction-route__value__name">RELAY</div>
        <div className="transaction-route__value__name transaction-route__value__name--green">
          Instant
        </div>
      </div>

      <div className="transaction-route__route">
        <div className="transaction-route__key">
          <span>Deposit Gas</span>
          <div className="transaction-route__key__chain">
            {depositChainName}
          </div>
        </div>
        <div className="transaction-route__value__name">
          <GreenDot int={intDeposit} dec={decDeposit} />
        </div>
        <div className="transaction-route__value__name transaction-route__value__name--green">
          {depositCurrencyTicker}
        </div>
      </div>

      {!hideFill && (
        <div className="transaction-route__route">
          <div className="transaction-route__key">
            <span>Fill Gas</span>
            {fillChainName && (
              <div className="transaction-route__key__chain">
                {fillChainName}
              </div>
            )}
          </div>
          <SkeletonLoaderWrapper
            radius={6}
            height={30}
            width={"auto"}
            isLoading={isLoading}
            flex={isLoading}
          >
            <div className="transaction-route__value__name">
              <GreenDot int={intFill} dec={decFill} />
            </div>
            <div className="transaction-route__value__name transaction-route__value__name--green">
              {fillCurrencyTicker}
            </div>
          </SkeletonLoaderWrapper>
        </div>
      )}
    </div>
  );
};

export default TransactionRoute;
//18
//6
//792703809

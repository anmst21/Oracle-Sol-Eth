import React from "react";
import { relayLogoUri } from "@/helpers/relay-logo-uri";
import Image from "next/image";
import GreenDot from "../green-dot";
import ClockInfo from "../icons/ClockInfo";

type Props = {
  depositChainName: string | undefined;
  depositGasValue: string | undefined;
  depositCurrencyTicker: string | undefined;
  fillChainName: string | undefined;
  fillGasValue: string | undefined;
  fillCurrencyTicker: string | undefined;
  relayFeeValue: string | undefined;
  appFeeValue: string | undefined;
  hideFill: boolean;
  appFeeTicker: string | undefined;
  timeEstimate?: number | undefined;
};

const TransactionRoute = ({
  depositChainName,
  depositCurrencyTicker,
  depositGasValue,
  fillChainName,
  fillCurrencyTicker,
  fillGasValue,
  appFeeValue,
  relayFeeValue,
  hideFill,
  appFeeTicker,
  timeEstimate,
}: Props) => {
  const [intDeposit, decDeposit] = String(depositGasValue).split(".");
  const [intFill, decFill] = String(fillGasValue).split(".");
  const [intRelay, decRelay] = String(relayFeeValue).split(".");
  const [intApp, decApp] = String(appFeeValue).split(".");

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
            <div className="transaction-route__key__chain">{fillChainName}</div>
          </div>
          <div className="transaction-route__value__name">
            <GreenDot int={intFill} dec={decFill} />
          </div>
          <div className="transaction-route__value__name transaction-route__value__name--green">
            {fillCurrencyTicker}
          </div>
        </div>
      )}
      <div className="transaction-route__route">
        <div className="transaction-route__key">
          <span>Relay Fee</span>
        </div>
        <div className="transaction-route__value__name">
          <GreenDot int={intRelay} dec={decRelay} />
        </div>
        <div className="transaction-route__value__name transaction-route__value__name--green">
          {appFeeTicker}
        </div>
      </div>
      <div className="transaction-route__route">
        <div className="transaction-route__key">
          <span>App Fee</span>
        </div>
        <div className="transaction-route__value__name">
          <GreenDot int={intApp} dec={decApp} />
        </div>
        <div className="transaction-route__value__name transaction-route__value__name--green">
          {appFeeTicker}
        </div>
      </div>
      {timeEstimate && (
        <div className="transaction-route__route">
          <div className="transaction-route__key">
            <span>Time</span>
          </div>
          <div className="transaction-route__route__relay">
            <ClockInfo />
          </div>
          <div className="transaction-route__value__name">~{timeEstimate}</div>
          <div className="transaction-route__value__name transaction-route__value__name--green">
            Sec
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionRoute;
//18
//6
//792703809

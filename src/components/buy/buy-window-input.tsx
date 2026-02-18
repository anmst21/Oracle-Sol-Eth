import { OnrampFiatCurrency } from "@/types/coinbase-onramp";
import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import getSymbolFromCurrency from "currency-symbol-map";
import { UnifiedToken } from "@/types/coin-types";
import { InputType, OracleRouteType } from "./types";
import {
  BuySwitch,
  // BuySwitchLg,
  HexChain,
  BuyChev,
  BuyDirect,
  BuyOracleRoute,
  ErrorBack,
  ErrorRegions,
} from "../icons";
import Image from "next/image";
import { getIconUri } from "@/helpers/get-icon-uri";
import { useTokenModal } from "@/context/TokenModalProvider";
import { splitCompact } from "@/helpers/compact-formatter";
import { AnimatePresence, motion } from "motion/react";
import classNames from "classnames";
import BuyInfoModal from "./buy-info-modal";
import { useRouter } from "next/navigation";
import { useOnRamp } from "@/context/OnRampProvider";

type Props = {
  fiatCurrencies: OnrampFiatCurrency[];
  fiatCurrency: OnrampFiatCurrency;
  setFiatCurrency: Dispatch<SetStateAction<OnrampFiatCurrency>>;
  setValue: (value: string) => void;
  value: string;
  activeToken: UnifiedToken;
  setActiveToken: (token: UnifiedToken) => void;
  isBuyAllowed: boolean;
  inputType: InputType;
  switchInputType: () => void;
  onCurrenciesOpen: () => void;
  isError: boolean;
  routeType: OracleRouteType;
  countryName: string;
  conversionValue?: string;
  isLoadingQuote?: boolean;
  onPresetClick: (amt: string) => void;
};

const presets = [5, 12.5, 25, 50];

const BuyWindowInput = ({
  // fiatCurrencies,
  // setFiatCurrency,
  fiatCurrency,
  setValue,
  value,
  activeToken,
  setActiveToken,
  // isBuyAllowed,
  routeType,
  inputType,
  switchInputType,
  onCurrenciesOpen,
  isError,
  countryName,
  conversionValue,
  isLoadingQuote,
  onPresetClick,
}: Props) => {
  // console.log("fiatCurrencies", fiatCurrencies);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { openTokenModal } = useTokenModal();
  const { setIsOpenRegions } = useOnRamp();
  const { back } = useRouter();

  const modalItems = [
    {
      name: "Direct Buy",
      icon: <BuyDirect />,
      description:
        "Buy the token straight from Coinbase. Fast and simple—works only for assets Coinbase supports.",
    },
  ];
  const sortedItems = useMemo(() => {
    const newItem = {
      name: "Oracle Route",
      icon: <BuyOracleRoute />,
      description:
        "Buy a common asset (e.g., USDC/ETH), then swap to your token. One extra step, but works for almost any token.",
    };

    return routeType === OracleRouteType.DIRECT
      ? [...modalItems, newItem] // add to end
      : [newItem, ...modalItems]; // add to start
  }, [routeType]);

  return (
    <div className="buy-window-input">
      <div
        className={classNames("buy-window-input__top", {
          "buy-window-input__top--error": isError,
        })}
      >
        <button onClick={onCurrenciesOpen} className="buy-window-input__region">
          <Image
            src={fiatCurrency.icon}
            alt={fiatCurrency.name}
            width={24}
            height={24}
          />
        </button>
        <button
          onClick={() =>
            openTokenModal({ mode: "onramp", onSelect: setActiveToken })
          }
          className="buy-window-input__token"
        >
          <div className="token-to-buy__token__icon">
            {activeToken.chainId && (
              <HexChain width={25} uri={getIconUri(activeToken.chainId)} />
            )}
            <div className="user-placeholder user-placeholder--md">
              {activeToken.logo && (
                <Image
                  src={activeToken.logo}
                  width={24}
                  height={24}
                  alt={`${activeToken.symbol} coin`}
                />
              )}
            </div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeToken.symbol}
              className="buy-window-input__top__token"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <span className="buy-window-input__top__name">
                {activeToken.symbol}
              </span>
              <span className="buy-window-input__top__symbol">
                {activeToken.name}
              </span>
            </motion.div>
          </AnimatePresence>
          <BuyChev />
        </button>
        <div
          onMouseLeave={() => {
            if (isOpenModal) setIsOpenModal(false);
          }}
          onClick={() => setIsOpenModal((prev) => !prev)}
          className={classNames("buy-window-input__switch", {
            "buy-window-input__switch--active": isOpenModal,
          })}
        >
          {routeType === OracleRouteType.ORACLE ? (
            <BuyOracleRoute />
          ) : (
            <BuyDirect />
          )}

          <BuyInfoModal
            modalItems={sortedItems}
            closeModal={() => setIsOpenModal(false)}
            isOpen={isOpenModal}
          />
        </div>
      </div>
      {!isError ? (
        <label className="buy-window-input__input">
          <div className="buy-window-input__input__wrapper">
            {inputType === "fiat" && (
              <div className="buy-window-input__input__currency">
                {getSymbolFromCurrency(fiatCurrency.code)}
              </div>
            )}
            <input
              inputMode="decimal"
              min="0"
              style={{
                width: value.length === 0 ? "1ch" : `${value.length}ch`,
              }}
              placeholder="0"
              type="number"
              pattern="[0-9]*"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            {inputType === "crypto" && (
              <div className="buy-window-input__input__symbol">
                {activeToken.symbol}
              </div>
            )}
          </div>
          <div className="buy-window-input__input__quote">
            <button
              className="buy-window-input__input__switch"
              onClick={switchInputType}
            >
              <BuySwitch />
            </button>
            <div className="buy-window-input__input__value">
              <motion.span
                animate={{ opacity: isLoadingQuote ? 0 : 1 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {inputType === "crypto" &&
                  getSymbolFromCurrency(fiatCurrency.code)}
                <span>
                  {conversionValue
                    ? parseFloat(conversionValue).toLocaleString(
                        undefined,
                        { maximumFractionDigits: 6 }
                      )
                    : "0.00"}
                </span>
                {inputType === "fiat" && ` ${activeToken.symbol}`}
              </motion.span>
            </div>
          </div>
        </label>
      ) : (
        <div className="buy-window-input__input">
          <h4>Not available in your region</h4>
          <p>
            Fiat on-ramp isn&apos;t supported in {countryName} yet. Browse
            regions or go back.
          </p>
        </div>
      )}
      {!isError ? (
        <div className="buy-window-input__bottom">
          {presets.map((item, i) => {
            const amt = String(item * fiatCurrency.minBuyAmount);

            const amtArray = splitCompact(item * fiatCurrency.minBuyAmount);

            return (
              <button
                className="buy-window-input__preset"
                onClick={() => onPresetClick(amt)}
                key={i}
              >
                <span>
                  {getSymbolFromCurrency(fiatCurrency.code)}
                  <span>{amtArray[0]}</span>
                  {amtArray[1]}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="buy-window-input__bottom">
          <button
            onClick={() => back()}
            className="buy-window-input__bottom__back"
          >
            <ErrorBack />
            Go back
          </button>
          <div className="buy-window-input__bottom__whitespace" />
          <button
            onClick={() => setIsOpenRegions(true)}
            className="buy-window-input__bottom__regions"
          >
            Regions
            <ErrorRegions />
          </button>
        </div>
      )}
    </div>
  );
};

export default BuyWindowInput;

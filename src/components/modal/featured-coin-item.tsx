import React, { useMemo } from "react";
import { HexChain } from "../icons";
import Image from "next/image";
import { RelayToken, UnifiedToken } from "@/types/coin-types";
import { ModalMode } from "@/types/modal-mode";
type Props = {
  chainSrc: string | undefined;
  coinSrc: string | undefined;
  coinSymbol: string | undefined;
  token: RelayToken;
  isLoading: boolean;
  onSelect: (t: UnifiedToken) => void;
  modalMode: ModalMode;
};

const FeaturedCoinItem = ({
  chainSrc,
  coinSymbol,
  coinSrc,
  onSelect,
  // modalMode,
  token,
}: // isLoading,
Props) => {
  // const setActiveToken = useCallback(() => {
  //   const tokenData = {
  //     source: "eth" as const,
  //     chainId: token.chainId,
  //     address: token.address || "", // ditto
  //     symbol: coinSymbol || "",
  //     logo: coinSrc,
  //     priceUsd: undefined,
  //     balance: undefined,
  //     name: token.name || "",
  //   };

  //   if (modalMode === "buy") {
  //     setBuyToken(tokenData);
  //   }
  //   if (modalMode === "sell") {
  //     setSellToken(tokenData);
  //   }
  // }, [setBuyToken, setSellToken, token, modalMode, coinSrc, coinSymbol]);

  const tokenProps = useMemo<UnifiedToken>(
    () => ({
      source: token.chainId === 792703809 ? "sol" : ("eth" as const),
      chainId: token.chainId,
      address: token.address ?? "",
      symbol: coinSymbol ?? "",
      logo: coinSrc,
      priceUsd: undefined,
      balance: undefined,
      name: token.name ?? "",
    }),
    [token, coinSymbol, coinSrc]
  );
  return (
    <button onClick={() => onSelect(tokenProps)} className="featured-coin-item">
      <div className="token-to-buy__token__icon">
        {chainSrc && <HexChain width={25} uri={chainSrc} />}
        <div className="user-placeholder user-placeholder--md">
          {coinSrc && (
            <Image
              src={coinSrc}
              width={24}
              height={24}
              alt={`${coinSymbol} coin`}
            />
          )}
        </div>
      </div>
      <span>{coinSymbol}</span>
    </button>
  );
};

export default FeaturedCoinItem;

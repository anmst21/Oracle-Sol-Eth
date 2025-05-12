import React, { useCallback } from "react";
import { HexChain } from "../icons";
import Image from "next/image";
import { RelayToken, UnifiedToken } from "@/types/coin-types";
import { ModalMode } from "@/types/modal-mode";
type Props = {
  chainSrc: string | undefined;
  coinSrc: string | undefined;
  coinSymbol: string | undefined;
  token: RelayToken;

  setBuyToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  setSellToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  modalMode: ModalMode;
};

const FeaturedCoinItem = ({
  chainSrc,
  coinSymbol,
  coinSrc,
  setBuyToken,
  setSellToken,
  modalMode,
  token,
}: Props) => {
  const setActiveToken = useCallback(() => {
    if (modalMode === "buy") {
      setBuyToken({
        source: "eth" as const,
        chainId: token.chainId,
        address: token.address || "", // ditto
        symbol: coinSymbol || "",
        logo: coinSrc,
        priceUsd: undefined,
        balance: undefined,
        name: token.name || "",
      });
    }
    if (modalMode === "sell") {
      setSellToken({
        source: "eth" as const,
        chainId: token.chainId,
        address: token.address || "", // ditto
        symbol: coinSymbol || "",
        logo: coinSrc,
        priceUsd: undefined,
        balance: undefined,
        name: token.name || "",
      });
    }
  }, [setBuyToken, setSellToken, token, modalMode, coinSrc, coinSymbol]);
  return (
    <button onClick={setActiveToken} className="featured-coin-item">
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

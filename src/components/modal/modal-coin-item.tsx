import React, { useMemo } from "react";
import Image from "next/image";
import { truncateAddress } from "@/helpers/truncate-address";
import { HexChain } from "../icons";
import { UnifiedToken } from "@/types/coin-types";
import { ModalMode } from "@/types/modal-mode";

type Props = {
  coinSrc?: string;
  chainSrc: string | undefined;
  coinSymbol?: string;
  coinAddress: string;
  priceUsd?: number | null;
  priceNative?: number | null;
  userBalance?: number | undefined;
  coinName?: string;
  // setBuyToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  // setSellToken: React.Dispatch<React.SetStateAction<UnifiedToken | null>>;
  modalMode: ModalMode;
  chainId: number | undefined;
  onSelect: (t: UnifiedToken) => void;
};

const ModalCoinItem = ({
  coinAddress,
  coinSrc,
  coinSymbol,
  priceUsd,
  userBalance,
  coinName,
  chainSrc,
  priceNative,
  onSelect,
  chainId,
}: Props) => {
  // const setActiveToken = useCallback(() => {
  //   if (modalMode === "buy") {
  //     setBuyToken({
  //       source: "eth" as const,
  //       chainId: chainId,
  //       address: coinAddress, // ditto
  //       symbol: coinSymbol || "",
  //       logo: coinSrc,
  //       priceUsd: priceUsd || undefined,
  //       balance: userBalance || undefined,
  //       name: coinName || "",
  //     });
  //   }
  //   if (modalMode === "sell") {
  //     setSellToken({
  //       source: "eth" as const,
  //       chainId: chainId,
  //       address: coinAddress, // ditto
  //       symbol: coinSymbol || "",
  //       logo: coinSrc,
  //       priceUsd: priceUsd || undefined,
  //       balance: userBalance || undefined,
  //       name: coinName || "",
  //     });
  //   }
  // }, [
  //   setBuyToken,
  //   setSellToken,
  //   coinName,
  //   coinSymbol,
  //   coinSrc,
  //   userBalance,
  //   priceUsd,
  //   chainId,
  //   modalMode,
  //   coinAddress,
  // ]);

  const token = useMemo<UnifiedToken>(
    () => ({
      source: chainId === 792703809 ? "sol" : "eth",
      chainId,
      address: coinAddress,
      symbol: coinSymbol ?? "",
      logo: coinSrc,
      priceUsd: priceUsd ?? undefined,
      balance: userBalance ?? undefined,
      name: coinName ?? "",
    }),
    [chainId, coinAddress, coinSymbol, coinSrc, priceUsd, userBalance, coinName]
  );

  return (
    <button onClick={() => onSelect(token)} className="native-coin">
      <div className="token-to-buy__token__icon">
        {chainSrc && <HexChain width={32} uri={chainSrc} />}
        <div className="user-placeholder">
          {coinSrc && (
            <Image
              src={coinSrc}
              width={30}
              height={30}
              alt={`${coinSymbol} coin`}
            />
          )}
        </div>
      </div>

      <div className="native-coin__meta">
        <h3>{coinSymbol}</h3>
        <div className="native-coin__meta__bot">
          <span>{truncateAddress(coinAddress as string)}</span>
          <span className="name">{coinName ? coinName : "Name"}</span>
        </div>
      </div>

      {userBalance ? (
        <div className="native-coin__balance">
          {priceUsd && <h4>${(userBalance * priceUsd).toFixed(2)}</h4>}
          <span>
            {userBalance.toFixed(6)}
            <span className="coin-ticker">
              {" "}
              {chainId === 792703809 ? "SOL" : "ETH"}
            </span>
          </span>
        </div>
      ) : (
        priceUsd && (
          <div className="native-coin__balance">
            <h4>${priceUsd.toFixed(6)}</h4>
            {priceNative && (
              <span>
                {priceNative.toFixed(6)}
                <span className="coin-ticker">
                  {" "}
                  {chainId === 792703809 ? "SOL" : "ETH"}
                </span>
              </span>
            )}
          </div>
        )
      )}
    </button>
  );
};

export default ModalCoinItem;

import React from "react";
import Image from "next/image";
import { truncateAddress } from "@/helpers/truncate-address";
import { HexChain } from "../icons";
type Props = {
  coinSrc?: string;
  chainSrc: string | undefined;
  coinSymbol?: string;
  coinAddress: string;
  priceUsd?: number | null;
  userBalance?: number | undefined;
};

const ModalCoinItem = ({
  coinAddress,
  coinSrc,
  coinSymbol,
  priceUsd,
  userBalance,
  chainSrc,
}: Props) => {
  return (
    <div className="native-coin">
      {coinSrc && (
        <Image
          src={coinSrc}
          width={30}
          height={30}
          alt={`${coinSymbol} coin`}
        />
      )}
      {chainSrc && (
        <HexChain uri={chainSrc} />
        // <Image
        //   width={16}
        //   height={16}
        //   alt={`Chain for ${coinSymbol} coin`}
        //   src={chainSrc}
        // />
      )}
      <div className="native-coin__meta">
        <h3>{coinSymbol}</h3>
        <span>{truncateAddress(coinAddress as string)}</span>
      </div>

      {userBalance ? (
        <div className="native-coin__balance">
          {priceUsd && <h4>${(userBalance * priceUsd).toFixed(2)}</h4>}
          <span>{userBalance.toFixed(6)}</span>
        </div>
      ) : (
        priceUsd && (
          <div className="native-coin__balance">
            <span>{priceUsd.toFixed(6)}</span>
          </div>
        )
      )}
    </div>
  );
};

export default ModalCoinItem;

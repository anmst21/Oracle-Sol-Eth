import React from "react";
import Image from "next/image";
import { truncateAddress } from "@/helpers/truncate-address";
type Props = {
  coinSrc: string;
  chainSrc: string | undefined;
  coinSymbol: string;
  coinAddress: string;
  priceUsd: number | null;
  userBalance: number;
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
      <Image src={coinSrc} width={30} height={30} alt={`${coinSymbol} coin`} />
      {chainSrc && (
        <Image
          width={16}
          height={16}
          alt={`Chain for ${coinSymbol} coin`}
          src={chainSrc}
        />
      )}
      <div className="native-coin__meta">
        <h3>{coinSymbol}</h3>
        <span>{truncateAddress(coinAddress as string)}</span>
      </div>
      <div className="native-coin__balance">
        {priceUsd && <h4>${(userBalance * priceUsd).toFixed(2)}</h4>}
        <span>{userBalance.toFixed(6)}</span>
      </div>
    </div>
  );
};

export default ModalCoinItem;

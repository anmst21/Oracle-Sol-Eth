import { getIconUri } from "@/helpers/get-icon-uri";
import { truncateAddress } from "@/helpers/truncate-address";
import React from "react";
import { HexChain } from "../icons";

type Props = {
  chainId: number | undefined;
  address: string | undefined;
};

const WalletItem = ({ chainId, address }: Props) => {
  return (
    <div className={"swap-window__token__wallet"}>
      <div className="swap-window__token__wallet__pfp">
        <HexChain width={20} uri={getIconUri(chainId || 1)} />
      </div>

      <span>{address ? truncateAddress(address) : "Connect"}</span>
    </div>
  );
};

export default WalletItem;

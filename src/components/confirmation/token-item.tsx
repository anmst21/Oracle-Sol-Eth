import React, { useMemo } from "react";
import { HexChain } from "../icons";
import { getIconUri } from "@/helpers/get-icon-uri";
import Image from "next/image";
import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import GreenDot from "../green-dot";
type Props = {
  chainId: number | undefined;

  tokenName: string | undefined;
  tokenUri: string | undefined;
  ticker: string | undefined;
  amount: string | undefined;
  type: "from" | "to";
};

const TokenItem = ({
  chainId,
  tokenUri,
  tokenName,

  amount,
  ticker,
  type,
}: Props) => {
  const { chains } = useRelayChains();

  const activeChain = useMemo(
    () => chains?.find((chain) => chain.id === chainId),
    [chains, chainId]
  );
  const amtNumber = Number(amount);

  const amountFormatted = amtNumber.toFixed(amtNumber > 1 ? 2 : 6);

  const [int, dec] = amountFormatted.split(".");
  return (
    <div className="confirmation-token">
      <div className="token-to-buy__token__icon">
        {chainId && <HexChain width={32} uri={getIconUri(chainId)} />}

        <div className="user-placeholder">
          {tokenUri && (
            <Image
              src={tokenUri}
              width={30}
              height={30}
              alt={`${tokenName} token`}
              key={tokenName}
            />
          )}
        </div>
      </div>
      <div className="confirmation-token__chain">
        <span>{activeChain?.displayName}</span>
      </div>
      <div className="confirmation-token__amount">
        <span>
          <GreenDot int={int} dec={dec} />
        </span>
        <span>{ticker}</span>
      </div>

      <div className="confirmation-token__badge">{type}</div>
    </div>
  );
};

export default TokenItem;

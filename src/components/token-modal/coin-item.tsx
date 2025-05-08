import { useState, useEffect } from "react";
import Image from "next/image";
import { Address } from "viem";
import { usePrivy } from "@privy-io/react-auth";
import { Connection, PublicKey } from "@solana/web3.js";
import { zora, base, mainnet, degen } from "viem/chains";
import { Token } from "@/helpers/geckoNetworks";
import { FormattedCoin } from "@/types/CommunityCoins";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import { rpcSwitch } from "@/helpers/rpc-switch";
import { formatEthBalance, formatSolBalance } from "@/helpers/formatBalance";
import { getNativeBalance, getTokenBalance } from "@/helpers/getBalance";

export const connection = new Connection(rpcSwitch("solana") as string);

const communityChains = (id: number) => {
  switch (id) {
    case zora.id:
      return "zora";
    case base.id:
      return "base";
    case mainnet.id:
      return "ethereum";
    case degen.id:
      return "degen";
  }
};

const checkIfNative = (address: Address): boolean =>
  address === "0x0000000000000000000000000000000000000000";

type Props = {
  type: "gecko" | "solana" | "community" | "relay";
  coin: DexScreenerTokenMeta | FormattedCoin | MergedToken | Token;
  chain: string;
};

const CoinItem = ({ type, coin, chain }: Props) => {
  const { user } = usePrivy();
  const address = user?.wallet?.address;
  // These state variables will only be used for gecko type.
  const [balance, setBalance] = useState<bigint | string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    // Only fetch balance for gecko tokens if we have a user address.
    async function fetchBalance() {
      if (
        (type === "gecko" || type === "relay" || type === "community") &&
        address
      ) {
        let geckoCoin;
        let tokenAddress;
        let isNative: boolean | undefined;
        let communityChain: undefined | string;

        if (type === "gecko") {
          geckoCoin = coin as MergedToken;
          tokenAddress = geckoCoin.meta?.base?.attributes.address;
          isNative = checkIfNative(
            geckoCoin.meta?.base?.attributes.address as Address
          );
          console.log("gecko", geckoCoin);
        }
        if (type === "community") {
          geckoCoin = coin as FormattedCoin;
          const c = "chainId" in coin;
          tokenAddress = geckoCoin.address;
          communityChain = c
            ? communityChains(coin.chainId as number)
            : undefined;
          isNative = checkIfNative(geckoCoin.address as Address);
          console.log("gecko", geckoCoin);
        }
        if (type === "relay") {
          geckoCoin = coin as Token;
          tokenAddress = geckoCoin.address;
          isNative =
            geckoCoin.metadata?.isNative ||
            checkIfNative(geckoCoin.address as Address);
          console.log("relay", geckoCoin);
        }

        if (!tokenAddress) return;
        setLoading(true);
        try {
          const result = await (isNative ? getNativeBalance : getTokenBalance)(
            tokenAddress as Address,
            address as Address,
            communityChain ? communityChain : chain
          );

          setBalance(formatEthBalance(result));
        } catch (err) {
          console.error(err);
          setError("Failed to fetch balance");
        } finally {
          setLoading(false);
        }
      } else if (type === "solana") {
        try {
          const solCoin = coin as DexScreenerTokenMeta;
          console.log("solCoin", solCoin);
          const solanaAddress = solCoin.baseToken.address;
          if (!solanaAddress) return;

          const publicKey = new PublicKey(solanaAddress);
          const lamports = await connection.getBalance(publicKey);
          // Convert lamports to SOL (1 SOL = 1e9 lamports)
          setBalance(formatSolBalance(lamports));
        } catch (err) {
          console.error(err);
          setError("Failed to fetch Solana balance");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchBalance();
  }, [type, coin, address, chain]);

  if (type === "gecko") {
    const geckoCoin = coin as MergedToken;
    return (
      <button className="coin-item" key={geckoCoin.id}>
        {geckoCoin.meta?.base?.attributes.image_url && (
          <Image
            width={24}
            height={24}
            src={geckoCoin.meta?.base?.attributes.image_url}
            alt={geckoCoin.meta?.base?.attributes.name}
          />
        )}
        ${geckoCoin.meta?.base?.attributes.symbol}
        {/* Display balance if available */}
        {loading ? (
          <span> Loading...</span>
        ) : error ? (
          <span> {error}</span>
        ) : balance !== null ? (
          <span> Balance: {balance.toString()}</span>
        ) : null}
      </button>
    );
  }
  if (type === "relay") {
    const relayCoin = coin as Token;
    if (!relayCoin.metadata?.logoURI) return null;
    return (
      <button className="coin-item" key={relayCoin.address}>
        <Image
          width={24}
          height={24}
          src={relayCoin.metadata?.logoURI}
          alt={relayCoin.name ? relayCoin.name : "Relay token"}
        />
        ${relayCoin.symbol}
        {loading ? (
          <span> Loading...</span>
        ) : error ? (
          <span> {error}</span>
        ) : balance !== null ? (
          <span> Balance: {balance.toString()}</span>
        ) : null}
      </button>
    );
  }
  if (type === "solana") {
    const solanaCoin = coin as DexScreenerTokenMeta;
    return (
      <button className="coin-item" key={solanaCoin.baseToken.address}>
        {solanaCoin.info.imageUrl && (
          <Image
            width={24}
            height={24}
            src={solanaCoin.info.imageUrl}
            alt={solanaCoin.baseToken.name}
          />
        )}
        ${solanaCoin.baseToken.symbol.toUpperCase()}
        {loading ? (
          <span> Loading...</span>
        ) : error ? (
          <span> {error}</span>
        ) : balance !== null ? (
          <span> Balance: {balance.toString()}</span>
        ) : null}
      </button>
    );
  }
  if (type === "community") {
    const communityCoin = coin as FormattedCoin;
    console.log("communityCoin");
    return (
      <button className="coin-item" key={communityCoin.symbol}>
        {communityCoin.metadata.logoURI && (
          <Image
            width={24}
            height={24}
            src={communityCoin.metadata.logoURI}
            alt={communityCoin.symbol}
          />
        )}
        ${communityCoin.symbol.toUpperCase()}
        {loading ? (
          <span> Loading...</span>
        ) : error ? (
          <span> {error}</span>
        ) : balance !== null ? (
          <span> Balance: {balance.toString()}</span>
        ) : null}
      </button>
    );
  }
};

export default CoinItem;

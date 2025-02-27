import { Token } from "@/helpers/geckoNetworks";
import { FormattedCoin } from "@/types/CommunityCoins";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import Image from "next/image";

type Props = {
  type: "gecko" | "solana" | "community" | "relay";
  coin: DexScreenerTokenMeta | FormattedCoin | MergedToken | Token;
};

const CoinItem = ({ type, coin }: Props) => {
  if (type === "gecko") {
    // Type assertion can be used if needed, or check for properties
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
      </button>
    );
  }
  if (type === "relay") {
    // Type assertion can be used if needed, or check for properties
    const geckoCoin = coin as Token;
    if (!geckoCoin.metadata?.logoURI) return;
    return (
      <button className="coin-item" key={geckoCoin.address}>
        <Image
          width={24}
          height={24}
          src={geckoCoin.metadata?.logoURI}
          alt={geckoCoin.name ? geckoCoin.name : "Relay token"}
        />
        ${geckoCoin.symbol}
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
      </button>
    );
  }
  if (type === "community") {
    const communityCoin = coin as FormattedCoin;
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
      </button>
    );
  }
};

export default CoinItem;

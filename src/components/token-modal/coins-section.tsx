import { FormattedCoin } from "@/types/CommunityCoins";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import CoinItem from "./coin-item";
import { Token } from "@/helpers/geckoNetworks";

type Props = {
  coinsArray:
    | DexScreenerTokenMeta[]
    | FormattedCoin[]
    | MergedToken[]
    | Token[]
    | null;
  sectionName: string;
  sectionType: "gecko" | "solana" | "community" | "relay";
  chain: string;
};

const CoinsSection = ({
  coinsArray,
  sectionName,
  sectionType,
  chain,
}: Props) => {
  return (
    <div className="token-modal__section">
      <span>{sectionName}</span>
      <div className="token-modal__coins">
        {coinsArray?.map((coin, index) => {
          return (
            <CoinItem
              chain={chain}
              key={index}
              type={sectionType}
              coin={coin}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CoinsSection;

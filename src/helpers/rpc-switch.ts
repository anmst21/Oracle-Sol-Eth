import { mainnet, base, arbitrum, polygon, degen, zora } from "viem/chains";

export const rpcSwitch = (chain: string) => {
  switch (chain) {
    case "base":
      return "https://base-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
    case "ethereum":
      return "https://eth-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
    case "arbitrum":
      return "https://arb-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
    case "polygon":
      return "https://polygon-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
    case "degen":
      return "https://degen-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
    case "zora":
      return "https://zora-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
    case "solana":
      return "https://solana-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
    case "optimism":
      return "https://opt-mainnet.g.alchemy.com/v2/REDACTED_ALCHEMY_KEY";
  }
};

export const chainSwitch = (chain: string) => {
  switch (chain) {
    case "base":
      return base;

    case "ethereum":
      return mainnet;
    case "arbitrum":
      return arbitrum;
    case "polygon_pos":
      return polygon;
    case "degen":
      return degen;
    case "zora":
      return zora;
  }
};

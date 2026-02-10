import { mainnet, base, arbitrum, polygon, degen, zora } from "viem/chains";

const alchemyKey = process.env.ALCHEMY_API_KEY;

const alchemyRpc = (network: string) =>
  `https://${network}.g.alchemy.com/v2/${alchemyKey}`;

export const rpcSwitch = (chain: string) => {
  switch (chain) {
    case "base":
      return alchemyRpc("base-mainnet");
    case "ethereum":
      return alchemyRpc("eth-mainnet");
    case "arbitrum":
      return alchemyRpc("arb-mainnet");
    case "polygon":
      return alchemyRpc("polygon-mainnet");
    case "degen":
      return alchemyRpc("degen-mainnet");
    case "zora":
      return alchemyRpc("zora-mainnet");
    case "solana":
      return alchemyRpc("solana-mainnet");
    case "optimism":
      return alchemyRpc("opt-mainnet");
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

import { UnifiedToken } from "@/types/coin-types";

export const solanaToken: UnifiedToken = {
  source: "coinbase",
  chainId: 792703809,
  address: "11111111111111111111111111111111",
  symbol: "SOL",
  logo: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png",
  name: "Solana",
};

export const getEthToken = (chainId: number): UnifiedToken => {
  return {
    source: "eth",
    chainId,
    address: "0x0000000000000000000000000000000000000000",
    symbol: "ETH",
    logo: `https://api.sim.dune.com/v1/token/logo/${chainId}`,
    priceUsd: 2587.158951,
    balance: 0.005108842283747209,
    name: "Ether",
  };
};

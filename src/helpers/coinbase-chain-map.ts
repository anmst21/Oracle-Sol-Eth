/** Maps Coinbase network name -> Relay chain ID */
const coinbaseNetworkToChainId: Record<string, number> = {
  "ethereum-mainnet": 1,
  "base-mainnet": 8453,
  "solana-mainnet": 792703809,
  "polygon-mainnet": 137,
  "arbitrum-mainnet": 42161,
  "optimism-mainnet": 10,
  "zora-mainnet": 666666666,
  // Coinbase also uses short names in some responses
  ethereum: 1,
  base: 8453,
  solana: 792703809,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  zora: 666666666,
};

export function getCoinbaseChainId(networkName: string): number | null {
  return coinbaseNetworkToChainId[networkName] ?? null;
}

const chainIdToCoinbaseNetwork: Record<number, string> = {
  1: "ethereum",
  8453: "base",
  792703809: "solana",
  137: "polygon",
  42161: "arbitrum",
  10: "optimism",
  666666666: "zora",
};

export function getCoinbaseNetworkName(chainId: number): string | null {
  return chainIdToCoinbaseNetwork[chainId] ?? null;
}

export const supportedCoinbaseNetworks = new Set(
  Object.keys(coinbaseNetworkToChainId)
);

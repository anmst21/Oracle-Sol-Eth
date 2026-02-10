/** Maps MoonPay networkCode → Relay chain ID */
const moonpayNetworkToChainId: Record<string, number> = {
  ethereum: 1,
  base: 8453,
  solana: 792703809,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  zora: 666666666,
};

export function getMoonpayChainId(networkCode: string): number | null {
  return moonpayNetworkToChainId[networkCode] ?? null;
}

export const supportedMoonpayNetworks = new Set(
  Object.keys(moonpayNetworkToChainId)
);

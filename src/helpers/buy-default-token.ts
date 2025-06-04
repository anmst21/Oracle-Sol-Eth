import { UnifiedToken } from "@/types/coin-types";

export const buyDefaultToken: UnifiedToken = {
  chainId: 8453,
  address: "0x0000000000000000000000000000000000000000",
  symbol: "ETH",
  name: "Ether",
  decimals: 18, // ← this was missing
  source: "relay", // ← must match the exact union
  logo: "https://assets.relay.link/icons/1/light.png",
  // (optional) metadata, vmType, etc. if they exist on UnifiedToken
};

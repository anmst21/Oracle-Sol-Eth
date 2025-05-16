export type SwapWallet = {
  type: "ethereum" | "solana";
  address: string;
  chainId: number;
};

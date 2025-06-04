export type SwapWallet = {
  type: "ethereum" | "solana";
  address: string;
  chainId: number;
};

export type PastedWallet = SwapWallet & { isPasted: true };

export enum TradeType {
  EXACT_INPUT = "EXACT_INPUT",
  EXACT_OUTPUT = "EXACT_OUTPUT",
}

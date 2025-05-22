export type SwapWallet = {
  type: "ethereum" | "solana";
  address: string;
  chainId: number;
};



export enum TradeType {
  EXACT_INPUT = "EXACT_INPUT",
  EXACT_OUTPUT = "EXACT_OUTPUT",
}
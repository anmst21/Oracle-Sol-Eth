export interface DexEntry {
  id: string;
  fid: number;
  dex: string;
  tokenFrom: string;
  tokenTo: string;
  symbolFrom: string;
  symbolTo: string;
  tokenAmountFrom: string;
  tokenAmountTo: string;
  amountFromUsdAtTxnMoment: string;
  amountToUsdAtTxnMoment: string;
  recipient: string;
  originator: string;
  liquidityPool: string;
  gasPriceUsd: string;
  chainTimestamp: string;
  chainId: number;
  blockNumber: number;
  txnHash: string;
}

export interface DexResponse {
  entries: DexEntry[];
}

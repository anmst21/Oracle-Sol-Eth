import { DexEntry } from "./feed-api-response";

export type RelayTokenMeta = {
  chainId?: number | undefined;
  address?: string | undefined;
  symbol?: string | undefined;
  name?: string | undefined;
  decimals?: number | undefined;
  vmType?: "evm" | "svm" | "bvm" | "tvm" | "suivm" | "tonvm" | undefined;
  metadata?:
    | {
        logoURI?: string | undefined;
        verified?: boolean | undefined;
        isNative?: boolean | undefined;
      }
    | undefined;
};

export type TokenKey = `${number}:${string}`;

export type EnrichedDexEntry = DexEntry & {
  tokenFromKey?: TokenKey;
  tokenToKey?: TokenKey;
  tokenFromCurrency?: RelayTokenMeta;
  tokenToCurrency?: RelayTokenMeta;
};

export type MetaByKey = Record<TokenKey, RelayTokenMeta>;

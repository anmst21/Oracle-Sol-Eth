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

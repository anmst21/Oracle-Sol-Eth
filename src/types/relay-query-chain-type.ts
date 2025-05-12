export type RelayChain = {
  id?: number | undefined;
  name?: string | undefined;
  displayName?: string | undefined;
  httpRpcUrl?: string | undefined;
  wsRpcUrl?: string | undefined;
  explorerUrl?: string | undefined;
  explorerName?: string | undefined;
  explorerPaths?:
    | {
        transaction?: string | undefined;
      }
    | null
    | undefined;
  depositEnabled?: boolean | undefined;
  tokenSupport?: "All" | "Limited" | undefined;
  disabled?: boolean | undefined;
  partialDisableLimit?: number | undefined;
  blockProductionLagging?: boolean | undefined;
  currency?:
    | {
        id?: string | undefined;
        symbol?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        decimals?: number | undefined;
        supportsBridging?: boolean | undefined;
      }
    | undefined;
  withdrawalFee?: number | undefined;
  depositFee?: number | undefined;
  surgeEnabled?: boolean | undefined;
  featuredTokens?:
    | {
        id?: string | undefined;
        symbol?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        decimals?: number | undefined;
        supportsBridging?: boolean | undefined;
        metadata?:
          | {
              logoURI?: string | undefined;
            }
          | undefined;
      }[]
    | undefined;
  erc20Currencies?:
    | {
        id?: string | undefined;
        symbol?: string | undefined;
        name?: string | undefined;
        address?: string | undefined;
        decimals?: number | undefined;
        supportsBridging?: boolean | undefined;
        supportsPermit?: boolean | undefined;
        withdrawalFee?: number | undefined;
        depositFee?: number | undefined;
        surgeEnabled?: boolean | undefined;
      }[]
    | undefined;
  iconUrl?: string | null | undefined;
  logoUrl?: string | null | undefined;
  brandColor?: string | null | undefined;
  contracts?:
    | {
        multicall3?: string | undefined;
        multicaller?: string | undefined;
        onlyOwnerMulticaller?: string | undefined;
        relayReceiver?: string | undefined;
        erc20Router?: string | undefined;
        approvalProxy?: string | undefined;
      }
    | undefined;
  vmType?: "evm" | "svm" | "bvm" | undefined;
  explorerQueryParams?:
    | {
        [key: string]: unknown;
      }
    | null
    | undefined;
  baseChainId?: number | null | undefined;
  statusMessage?: string | null | undefined;
  tags?: string[] | undefined;
};

export type RelayChainFetch = {
  id?: number;
  name?: string;
  displayName?: string;
  httpRpcUrl?: string;
  wsRpcUrl?: string;
  explorerUrl?: string;
  explorerName?: string;
  explorerPaths?: {
    transaction?: string;
  } | null;
  /** @description If the network supports depositing to this chain, e.g. allows this chain to be set as the destination chain */
  depositEnabled?: boolean;
  /** @enum {string} */
  tokenSupport?: "All" | "Limited";
  /** @description If relaying to and from this chain is disabled */
  disabled?: boolean;
  /** @description The value limit at which the chain is partially disabled, if 0, the chain is not partially disabled. i.e, 1000000000000000000 to designate 1 ETH max withdrawal/deposit */
  partialDisableLimit?: number;
  /** @description If the chain is experiencing issues where blocks are lagging behind or not being produced */
  blockProductionLagging?: boolean;
  currency?: {
    id?: string;
    symbol?: string;
    name?: string;
    address?: string;
    decimals?: number;
    supportsBridging?: boolean;
  };
  /** @description The fee in bps for withdrawing from this chain */
  withdrawalFee?: number;
  /** @description The fee in bps for depositing to this chain */
  depositFee?: number;
  /** @description If the chain has surge pricing enabled */
  surgeEnabled?: boolean;
  /** @description An array of featured erc20 currencies */
  featuredTokens?: {
    id?: string;
    symbol?: string;
    name?: string;
    address?: string;
    decimals?: number;
    /** @description If the currency supports bridging */
    supportsBridging?: boolean;
    metadata?: {
      logoURI?: string;
    };
  }[];
  /** @description An array of erc20 currencies that the chain supports */
  erc20Currencies?: {
    id?: string;
    symbol?: string;
    name?: string;
    address?: string;
    decimals?: number;
    /** @description If the currency supports bridging */
    supportsBridging?: boolean;
    /** @description If the erc20 currency supports permit via signature (EIP-2612) */
    supportsPermit?: boolean;
    /** @description The fee in bps for withdrawing from this chain */
    withdrawalFee?: number;
    /** @description The fee in bps for depositing to this chain */
    depositFee?: number;
    /** @description If the chain has surge pricing enabled */
    surgeEnabled?: boolean;
  }[];
  /** @description The URL to the chain icon */
  iconUrl?: string | null;
  /** @description The URL to the chain logo */
  logoUrl?: string | null;
  /** @description Brand color code */
  brandColor?: string | null;
  /** @description Relay contract addresses */
  contracts?: {
    multicall3?: string;
    multicaller?: string;
    onlyOwnerMulticaller?: string;
    relayReceiver?: string;
    erc20Router?: string;
    approvalProxy?: string;
  };
  /**
   * @description The type of VM the chain runs on
   * @enum {string}
   */
  vmType?: "bvm" | "evm" | "svm";
  explorerQueryParams?: {
    [key: string]: unknown;
  } | null;
  /** @description The chain id which the chain rolls up to. This is always set as Ethereum for L1 chains */
  baseChainId?: number | null;
  /** @description If applicable, a status message for the chain */
  statusMessage?: string | null;
  tags?: string[];
};

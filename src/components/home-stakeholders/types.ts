export type StakeholderType =
  | "featured"
  | "swap"
  | "coins"
  | "social"
  | "creator"
  | "data"
  | "protocol";

export const STAKEHOLDER_TYPES: StakeholderType[] = [
  "featured",
  "swap",
  "coins",
  "social",
  "creator",
  "data",
  "protocol",
];

export const STAKEHOLDER_ITEMS: Record<StakeholderType, string[]> = {
  featured: ["swap"], // change to whatever items you want
  swap: ["relay", "coinbase", "privy"],
  coins: ["geckoterminal", "dexscreener", "farcasterin"],
  social: ["warpcast"],
  creator: ["nexus"],
  data: ["sim", "dune"],
  protocol: ["balancer", "uniswap", "pancakeswap"],
};

export const stakeholderItems = [
  { category: "featured", key: "base" },
  { category: "swap", key: "relay" },
  { category: "swap", key: "coinbase" },
  { category: "swap", key: "privy" },
  { category: "coins", key: "geckoterminal" },
  { category: "coins", key: "dexscreener" },
  { category: "coins", key: "farcasterin" },
  { category: "social", key: "warpcast" },
  { category: "creator", key: "nexus" },
  { category: "data", key: "sim" },
  { category: "data", key: "dune" },
  { category: "protocol", key: "balancer" },
  { category: "protocol", key: "uniswap" },
  { category: "protocol", key: "pancakeswap" },
];

export type ActiveItem = {
  type: StakeholderType;
  id: string;
};

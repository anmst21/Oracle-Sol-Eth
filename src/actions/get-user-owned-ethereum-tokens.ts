"use server";
import { applyDecimals } from "@/helpers/apply-decimals";
import { duneEthChains } from "@/helpers/dune-eth-chains";
import { UnifiedToken } from "@/types/coin-types";
import { zeroAddress } from "viem";

const apiKey = process.env.DUNE_API_KEY;

interface TokenMetadata {
  logo: string;
}

export interface ChainBalance {
  chain: string;
  chain_id: number;
  address: string;
  amount: string;
  symbol: string;
  name: string;
  decimals: number;
  price_usd: number;
  value_usd: number;
  token_metadata: TokenMetadata;
}

export async function getTokenAccountsWithMetadata({
  address,
  chainId,
  offset,
}: {
  address: string;
  chainId?: number;
  offset?: number;
}): Promise<UnifiedToken[]> {
  if (!apiKey) {
    throw new Error("Missing DUNE_API_KEY");
  }

  const base = `https://api.dune.com/api/echo/v1/balances/evm/${address}`;

  // build chain_ids default or override
  const chainIds = chainId
    ? String(chainId)
    : duneEthChains.map((c) => c.id).join(",");

  const params = new URLSearchParams({ chain_ids: chainIds });

  params.set("exclude_spam_tokens", "exclude_spam_tokens");

  params.set("metadata", "logo");

  if (offset) {
    params.set("offset", String(offset));
  }

  params.set("limit", String(10));

  const url = `${base}?${params.toString()}`;

  const res = await fetch(url, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 60 * 60 },
    headers: {
      "X-Dune-Api-Key": apiKey,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Dune API error ${res.status}: ${text}`);
  }

  const data = (await res.json()) as { balances: ChainBalance[] };
  const formatted = data.balances.map((t) => ({
    source: "eth" as const,
    chainId: t.chain_id,
    address: t.address === "native" ? zeroAddress : t.address,
    symbol: t.symbol,
    logo: t.token_metadata.logo,
    priceUsd: t.price_usd,
    balance: Number(applyDecimals(t.amount, t.decimals)),
    name: t.name,
    decimals: t.decimals,
  }));

  return formatted;
}

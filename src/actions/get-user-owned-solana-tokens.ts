"use server";

import {
  Connection,
  GetProgramAccountsFilter,
  ParsedAccountData,
  PublicKey,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { UnifiedToken } from "@/types/coin-types";

const RPC_ENDPOINT = process.env.NEXT_PUBLIC_SOLANA_RPC;

interface TokenAccount {
  pubkey: string;
  mint: PublicKey;
  amount: number;
}

interface HeliosAsset {
  content: {
    files: { uri: string }[];
    metadata: {
      description: string;
      name: string;
      symbol: string;
      token_standard: string;
    };
  };
}

export interface EnrichedToken {
  pubkey: string;
  mint: string; // base58 string
  amount: number;
  imgUri: string;
  metadata: {
    description: string;
    name: string;
    symbol: string;
    token_standard: string;
  };
  priceUsd: number | null; // from Fluxbeam
}

export async function getTokenAccountsWithMetadata({
  address,
}: {
  address: string;
}): Promise<UnifiedToken[]> {
  // 1) load all SPL token accounts with non-zero balance

  if (!RPC_ENDPOINT) {
    return [];
  }
  const connection = new Connection(RPC_ENDPOINT, { commitment: "confirmed" });

  const wallet = new PublicKey(address);

  const filters: GetProgramAccountsFilter[] = [
    { dataSize: 165 },
    { memcmp: { offset: 32, bytes: wallet.toBase58() } },
  ];
  const raw = await connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
    filters,
  });
  const rawToSlice: TokenAccount[] = raw
    .map(({ pubkey, account }) => {
      const info = (account.data as ParsedAccountData).parsed.info;
      return {
        pubkey: pubkey.toBase58(),
        mint: new PublicKey(info.mint),
        amount: info.tokenAmount.uiAmount ?? 0,
      };
    })
    .filter((t) => t.amount > 0);

  const limit = 10;
  const tokens = rawToSlice.slice(0, limit);
  if (tokens.length === 0) return [];

  // 2) batch‐request Helius metadata
  const ids = tokens.map((t) => t.mint.toBase58());
  const heliusBody = {
    jsonrpc: "2.0",
    id: "getMetadata",
    method: "getAssetBatch",
    params: { ids },
  };
  const heliusRes = await fetch(RPC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(heliusBody),
  });
  if (!heliusRes.ok) {
    const txt = await heliusRes.text();
    throw new Error(`Helius getAssetBatch error (${heliusRes.status}): ${txt}`);
  }
  const { result: metadataBatch } = (await heliusRes.json()) as {
    result: HeliosAsset[];
  };

  // 3) for each token, fetch its price from Fluxbeam and combine
  const enriched: EnrichedToken[] = await Promise.all(
    tokens.map(async (tk, idx) => {
      // default to null if price lookup fails
      let priceUsd: number | null = null;
      try {
        const priceRes = await fetch(
          `https://data.fluxbeam.xyz/tokens/${tk.mint.toBase58()}/price`,
          { cache: "force-cache", next: { revalidate: 60 * 60 } }
        );
        if (priceRes.ok) {
          const price = await priceRes.json();
          priceUsd = typeof price === "number" ? price : null;
        }
      } catch (e) {
        console.warn(
          `Fluxbeam price fetch failed for ${tk.mint.toBase58()}:`,
          e
        );
      }

      return {
        pubkey: tk.pubkey,
        mint: tk.mint.toBase58(),
        amount: tk.amount,
        imgUri: metadataBatch[idx].content.files[0].uri,
        metadata: metadataBatch[idx].content.metadata,
        priceUsd,
      };
    })
  );
  const generalized = enriched.map((t) => ({
    source: "sol" as const,
    chainId: 792703809,
    address: t.mint,
    symbol: t.metadata.symbol,
    logo: t.imgUri,
    // nullish coalesce to undefined so it matches `number | undefined`
    priceUsd: t.priceUsd ?? undefined,
    balance: t.amount,
    name: t.metadata.name,
    decimals: 9,
  }));
  console.log("fetched tokens + metadata + prices", enriched);
  return generalized;
}

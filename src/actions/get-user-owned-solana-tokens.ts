"use server";

import {
  Connection,
  GetProgramAccountsFilter,
  ParsedAccountData,
  PublicKey,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

const RPC_ENDPOINT =
  "https://mainnet.helius-rpc.com/?api-key=REDACTED_HELIUS_KEY";
const connection = new Connection(RPC_ENDPOINT, { commitment: "confirmed" });
const wallet = new PublicKey("8dc4Gk3riGii9sASFB8EuEEJeQ5BruDWPZQW7so55JEp");

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

interface EnrichedToken {
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

export async function getTokenAccountsWithMetadata(): Promise<EnrichedToken[]> {
  // 1) load all SPL token accounts with non-zero balance
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
          `https://data.fluxbeam.xyz/tokens/${tk.mint.toBase58()}/price`
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

  console.log("fetched tokens + metadata + prices", enriched);
  return enriched;
}

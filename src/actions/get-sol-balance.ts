"use server";

import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Commitment,
} from "@solana/web3.js";

export type SolBalanceResponse = {
  balance: number;
  solUsdPrice: number | null;
};

export async function getSolBalance(
  address: string,
  commitment: Commitment = "confirmed"
): Promise<SolBalanceResponse | null> {
  const rpcUri = process.env.NEXT_PUBLIC_SOLANA_RPC;
  if (!rpcUri) {
    console.error("No rpc uri");
    return null;
  }

  try {
    // 1. connect to cluster
    const connection = new Connection(rpcUri, commitment);

    // 2. create PublicKey
    const pubkey = new PublicKey(address);

    // 3. fetch balance (in lamports)

    const lamports = await connection.getBalance(pubkey, commitment);

    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { cache: "force-cache", next: { revalidate: 60 * 60 } }
    );
    const json = (await res.json()) as { solana: { usd: number } };

    // 4. convert to SOL
    return {
      balance: lamports / LAMPORTS_PER_SOL,
      solUsdPrice: json.solana.usd || null,
    };
  } catch (err) {
    console.error("Error fetching sol balance:", err);
    return null;
  }
}

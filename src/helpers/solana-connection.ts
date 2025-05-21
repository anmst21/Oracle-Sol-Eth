// solana.ts
import {
  Connection,
  Commitment,
  Transaction,
  VersionedTransaction,
  SendOptions,
  Signer,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC;
if (!RPC_URL) {
  throw new Error("Missing NEXT_PUBLIC_SOLANA_RPC environment variable");
}

// now RPC_URL is a string, and “confirmed” is correctly typed
const commitment: Commitment = "confirmed";

export const connection = new Connection(RPC_URL, { commitment });

export const sendTransactionAdapter = async (
  tx: Transaction | VersionedTransaction,
  options?: SendOptions & { signers?: Signer[] }
): Promise<{ signature: string }> => {
  if (tx instanceof VersionedTransaction) {
    // non-deprecated: supports versioned
    const signature = await connection.sendTransaction(tx, options);
    return { signature };
  } else {
    // legacy Transaction path
    const { signers = [], ...confirmOpts } = options ?? {};
    const signature = await sendAndConfirmTransaction(
      connection,
      tx,
      signers,
      confirmOpts
    );
    return { signature };
  }
};

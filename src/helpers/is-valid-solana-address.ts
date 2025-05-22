import { PublicKey } from "@solana/web3.js";

export function isValidSolanaAddress(address: string): boolean {
  try {
    const pubkey = new PublicKey(address);
    // Optional: ensure it’s a “normal” key (not a PDA)
    return PublicKey.isOnCurve(pubkey);
  } catch {
    return false;
  }
}

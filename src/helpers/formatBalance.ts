import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { formatUnits } from "viem";

export const formatSolBalance = (lamports: number) =>
  (lamports / LAMPORTS_PER_SOL).toFixed(6);
export const formatEthBalance = (units: bigint) =>
  Number(formatUnits(units, 18)).toFixed(6);

"use client";

import React from "react";
import { RelayKitProvider } from "@reservoir0x/relay-kit-ui";
import {
  // createClient,
  MAINNET_RELAY_API,
  RelayChain,
} from "@reservoir0x/relay-sdk";
import { useTokenModal } from "./TokenModalProvider";

// createClient({
//   baseApiUrl: MAINNET_RELAY_API,
//   source: "oracleswap.app",
//   //  chains: chains as RelayChain[],
// });

export function RelayKitProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chains } = useTokenModal();
  // console.log("chains", chains);
  const options = {
    appName: "Oracl3",
    source: "oracleswap.app",
    appFees: [
      {
        recipient: "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce",
        fee: "100", // 1%
      },
    ],
    duneApiKey: process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "",
    ...(chains?.length ? { chains: chains as RelayChain[] } : {}),
    baseApiUrl: MAINNET_RELAY_API,
  };

  return (
    <RelayKitProvider options={options}>
      {/* @ts-expect-error relay-kit-ui bundles its own @types/react */}
      {children}
    </RelayKitProvider>
  );
}

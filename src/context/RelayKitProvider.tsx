"use client";

import React from "react";
import { RelayKitProvider } from "@reservoir0x/relay-kit-ui";
import {
  // createClient,
  MAINNET_RELAY_API,
  RelayChain,
} from "@reservoir0x/relay-sdk";
import { useTokenModal } from "./TokenModalProvider";

import { ReactNode } from "react";

// createClient({
//   baseApiUrl: MAINNET_RELAY_API,
//   source: "YOUR.SOURCE",
//   //  chains: chains as RelayChain[],
// });

export function RelayKitProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { chains } = useTokenModal();
  console.log("chains", chains);
  const options = {
    appName: "Oracl3",
    appFees: [
      {
        recipient: "0x0000000000000000000000000000000000000000",
        fee: "100", // 1%
      },
    ],
    duneApiKey: process.env.NEXT_PUBLIC_DUNE_API_KEY ?? "",
    chains: chains as RelayChain[],
    baseApiUrl: MAINNET_RELAY_API,
  };

  return (
    <RelayKitProvider options={options}>
      {children as unknown as ReactNode}
    </RelayKitProvider>
  );
}

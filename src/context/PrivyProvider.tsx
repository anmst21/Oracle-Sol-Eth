"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";
import {
  arbitrum,
  base,
  degen,
  mainnet,
  optimism,
  polygon,
  zora,
} from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createConfig, WagmiProvider } from "@privy-io/wagmi";
import { http } from "viem";

export const supportedChains = [
  arbitrum,
  base,
  degen,
  mainnet,
  optimism,
  polygon,
  zora,
] as const;

export const config = createConfig({
  chains: [arbitrum, base, degen, mainnet, optimism, polygon, zora], // Pass your required chains as an array
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [degen.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [zora.id]: http(),

    // For each of your required chains, add an entry to `transports` with
    // a key of the chain's `id` and a value of `http()`
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const solanaConnectors = toSolanaWalletConnectors();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_KEY as string}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}
      config={{
        loginMethods: ["wallet"],
        appearance: {
          walletChainType: "ethereum-and-solana",
          //  showWalletLoginFirst: true,
        },
        supportedChains: [
          mainnet,
          base,
          optimism,
          arbitrum,
          degen,
          zora,
          polygon,
        ],

        solanaClusters: [
          {
            name: "mainnet-beta",
            rpcUrl: "https://api.mainnet-beta.solana.com",
          },
        ],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        // loginMethods: ["wallet"],

        // only include minimal required fields to verify it works
        // defaultChain: baseSepolia,
        // supportedChains: [base, baseSepolia],
        //  walletChainType: "ethereum-and-solana",
      }}
      //   config={{
      //     supportedChains: [""],
      //   }}
      //   config={{
      //     defaultChain: baseSepolia,
      //     supportedChains: [base, baseSepolia],

      //     appearance: {
      //       loginMessage: "Connect your wallet to Display",
      //       landingHeader: "Display",
      //       walletList: ["coinbase_wallet"],
      //       walletChainType: "ethereum-only",
      //       theme: "dark",
      //       accentColor: "#FFCC00",
      //       logo: "/logo_new.png",
      //     },
      //   }}
    >
      <QueryClientProvider client={queryClient}>
        {" "}
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}

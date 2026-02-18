"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana";

import { useRelayChains } from "@reservoir0x/relay-kit-hooks";

const solanaConnectors = toSolanaWalletConnectors();

export default function Providers({ children }: { children: React.ReactNode }) {
  const { viemChains } = useRelayChains();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_KEY as string}
      clientId={process.env.NEXT_PUBLIC_CLIENT_ID as string}
      config={{
        loginMethods: ["wallet", "farcaster"],
        appearance: {
          walletChainType: "ethereum-and-solana",
          //  showWalletLoginFirst: true,
        },
        supportedChains: viemChains,

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
      {children}
    </PrivyProvider>
  );
}

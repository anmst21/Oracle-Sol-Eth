"use client";
import {
  ChainBalance as EthChainBalance,
  getTokenAccountsWithMetadata as getUserEthTokens,
} from "@/actions/get-user-owned-ethereum-tokens";
import {
  EnrichedToken,
  getTokenAccountsWithMetadata as getUserSolTokens,
} from "@/actions/get-user-owned-solana-tokens";
import Connect from "@/components/connects";
import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ModalChain } from "@/components/icons";
import classNames from "classnames";
import { getSolBalance, SolBalanceResponse } from "@/actions/get-sol-balance";
import { truncateAddress } from "@/helpers/truncate-address";
import { zeroAddress } from "viem";
import { applyDecimals } from "@/helpers/apply-decimals";
import ModalCoinItem from "@/components/modal/modal-coin-item";

export default function Home() {
  const [showAll, setShowAll] = useState(false);
  const [activeChainId, setActiveChainId] = useState<number>(0);
  const [userEthTokens, setUserEthTokens] = useState<EthChainBalance[] | null>(
    null
  );
  const [nativeSolBalance, setNativeSolBalance] =
    useState<SolBalanceResponse | null>(null);

  const [userSolanaTokens, setUserSolanaTokens] = useState<
    EnrichedToken[] | null
  >(null);
  console.log("nativeSolBalance", nativeSolBalance);
  useEffect(() => {
    const solNativeBalance = async () => {
      const balance = await getSolBalance(
        "8dc4Gk3riGii9sASFB8EuEEJeQ5BruDWPZQW7so55JEp"
      );
      setNativeSolBalance(balance);
    };
    const ethCoins = async () => {
      const tokens = await getUserEthTokens({
        address: "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce",
      });
      setUserEthTokens(tokens);
    };
    const solCoins = async () => {
      const tokens = await getUserSolTokens({
        address: "8dc4Gk3riGii9sASFB8EuEEJeQ5BruDWPZQW7so55JEp",
      });
      setUserSolanaTokens(tokens);
    };
    solNativeBalance();
    solCoins();
    ethCoins();
  }, []);

  const nativeTokens = useMemo(
    () => userEthTokens?.filter((t) => t.address === "native") ?? [],
    [userEthTokens]
  );
  const nonNativeUserEthTokens = useMemo(
    () => userEthTokens?.filter((t) => t.address !== "native") ?? [],
    [userEthTokens]
  );

  const { chains } = useRelayChains();

  const nonBitcoin = useMemo(
    () => (chains ?? []).filter((c) => c.id !== 8253038),
    [chains]
  );
  const featuredIds = useMemo(
    () => new Set<number>([7777777, 42161, 8453, 1, 56, 666666666, 792703809]),
    []
  );

  // 3. Partition into featured vs others
  const featuredChains = useMemo(
    () => nonBitcoin.filter((c) => featuredIds.has(c.id)),
    [nonBitcoin, featuredIds]
  );
  const otherChains = useMemo(
    () => nonBitcoin.filter((c) => !featuredIds.has(c.id)),
    [nonBitcoin, featuredIds]
  );

  const solanaChain = useMemo(
    () => featuredChains.find((chain) => chain.id === 792703809),
    [featuredChains]
  );

  const chainsToShow = showAll
    ? [...featuredChains, ...otherChains]
    : featuredChains;

  console.log("solanaChain", solanaChain);

  return (
    <div>
      <div className="modal-chains">
        <button
          className={classNames("chain-sidebar", {
            "chain-sidebar--active": activeChainId === 0,
          })}
          onClick={() => setActiveChainId(0)}
        >
          <ModalChain />
          <span>All Chains</span>
        </button>
        {chainsToShow.map((chain) => {
          return (
            <button
              className={classNames("chain-sidebar", {
                "chain-sidebar--active": activeChainId === chain.id,
              })}
              onClick={() => setActiveChainId(chain.id)}
              key={chain.id}
            >
              {chain.icon?.squaredDark && (
                <Image
                  alt={`${chain.displayName} Logo`}
                  width={24}
                  height={24}
                  src={chain.icon?.squaredDark}
                />
              )}
              <span>{chain.displayName}</span>
            </button>
          );
        })}
        <button onClick={() => setShowAll(!showAll)}>
          Show {showAll ? "less" : "more"}
        </button>
      </div>
      <div className="modal-native-coins">
        {nativeTokens && nativeTokens.length > 0 && (
          <div>
            <h2>Native Ethereum Balance</h2>
            {nativeTokens.map((token, i) => {
              const chain = featuredChains.find((c) => c.id === token.chain_id);
              console.log("token", token);
              const balanceNative = Number(
                applyDecimals(token.amount, token.decimals)
              ).toFixed(6);
              return (
                <ModalCoinItem
                  key={i}
                  userBalance={Number(balanceNative)}
                  priceUsd={token.price_usd}
                  coinAddress={
                    token.address === "native"
                      ? zeroAddress
                      : (token.address as string)
                  }
                  coinSymbol={token.symbol}
                  chainSrc={chain?.icon?.squaredDark}
                  coinSrc={token.token_metadata.logo}
                />
              );
            })}
          </div>
        )}
        {nativeSolBalance && nativeSolBalance.balance !== 0 && (
          <div>
            <h2>Native Solana Balance</h2>
            {solanaChain &&
              solanaChain?.icon?.light &&
              solanaChain?.icon?.squaredDark &&
              solanaChain.currency?.address &&
              solanaChain.currency?.symbol && (
                <ModalCoinItem
                  userBalance={nativeSolBalance.balance}
                  priceUsd={nativeSolBalance.solUsdPrice}
                  coinAddress={solanaChain.currency?.address}
                  coinSymbol={solanaChain.currency?.symbol}
                  chainSrc={solanaChain?.icon?.squaredDark}
                  coinSrc={solanaChain?.icon?.light}
                />
              )}
          </div>
        )}
        {nonNativeUserEthTokens && nonNativeUserEthTokens.length > 0 && (
          <div>
            <h2>Other Ethereum Tokens</h2>
            {nonNativeUserEthTokens.map((token, i) => {
              const chain = featuredChains.find((c) => c.id === token.chain_id);
              console.log("token", token);
              const balanceNative = Number(
                applyDecimals(token.amount, token.decimals)
              ).toFixed(6);
              return (
                <ModalCoinItem
                  key={i}
                  userBalance={Number(balanceNative)}
                  priceUsd={token.price_usd}
                  coinAddress={
                    token.address === "native"
                      ? zeroAddress
                      : (token.address as string)
                  }
                  coinSymbol={token.symbol}
                  chainSrc={chain?.icon?.squaredDark}
                  coinSrc={token.token_metadata.logo}
                />
              );
            })}
          </div>
        )}

        {userSolanaTokens &&
          userSolanaTokens.length > 0 &&
          nativeSolBalance &&
          nativeSolBalance.solUsdPrice && (
            <div>
              <h2>Other Solana Balances</h2>
              {/* {solanaChain &&
              solanaChain?.icon?.light &&
              solanaChain?.icon?.squaredDark &&
              solanaChain.currency?.address &&
              solanaChain.currency?.symbol && ( */}

              {userSolanaTokens.map((token, i) => {
                console.log("user solana token", token.amount);
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={token.amount}
                    priceUsd={token.priceUsd}
                    coinAddress={token.mint}
                    coinSymbol={token.metadata.symbol}
                    chainSrc={solanaChain?.icon?.squaredDark}
                    coinSrc={token.imgUri}
                  />
                );
              })}
            </div>
          )}
      </div>
      {/* <Connect /> */}
    </div>
  );
}

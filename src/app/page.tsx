// import {
//   ChainBalance as EthChainBalance,
//   getTokenAccountsWithMetadata as getUserEthTokens,
// } from "@/actions/get-user-owned-ethereum-tokens";
// import {
//   EnrichedToken,
//   getTokenAccountsWithMetadata as getUserSolTokens,
// } from "@/actions/get-user-owned-solana-tokens";
// import { useRelayChains, useTokenList } from "@reservoir0x/relay-kit-hooks";
// import { useEffect, useMemo, useState } from "react";

// import { getSolBalance, SolBalanceResponse } from "@/actions/get-sol-balance";
// import { useCommunityCoins } from "@/context/FarcasterCommunityTokensProvider";
// import { isAddress, zeroAddress } from "viem";
// import { applyDecimals } from "@/helpers/apply-decimals";
// import ModalCoinItem from "@/components/modal/modal-coin-item";
// import { useSolanaCoins } from "@/context/DexScreenerTrendingSolataTokensProvider";
// import { useGeckoTokens } from "@/context/GeckoTerminalCoinsProvider";
// import { queryTokenList } from "@reservoir0x/relay-kit-hooks";
// import ModalChains from "@/components/modal/modal-chains";
// import FeaturedCoinItem from "@/components/modal/featured-coin-item";
// import { InputCross, SearchGlass } from "@/components/icons";
// import { RelayToken, UnifiedToken } from "@/types/coin-types";

// function useDebounce<T>(value: T, delay: number): T {
//   const [debounced, setDebounced] = useState(value);
//   useEffect(() => {
//     const handle = setTimeout(() => setDebounced(value), delay);
//     return () => clearTimeout(handle);
//   }, [value, delay]);
//   return debounced;
// }

export default function Home() {
  // const [activeChainId, setActiveChainId] = useState<number>(0);

  // const [searchTerm, setSearchTerm] = useState(""); // raw input
  // const [searchTokens, setSearchTokens] = useState<RelayToken[]>([]); // fetched results
  // const [loadingSearchList, setLoadingSearchList] = useState(false);
  // const [errorSearching, setErrorSearching] = useState<string | null>(null);
  // // console.log("searchTokens", searchTokens);
  // const debouncedTerm = useDebounce(searchTerm, 500);

  // const { data: suggestedTokens } = useTokenList("https://api.relay.link", {
  //   limit: 10,
  //   term: "",
  //   chainIds: activeChainId === 0 ? undefined : [activeChainId],
  // });

  // useEffect(() => {
  //   if (!debouncedTerm) {
  //     setSearchTokens([]);
  //     setErrorSearching(null);
  //     return;
  //   }

  //   let cancelled = false;
  //   setLoadingSearchList(true);
  //   setErrorSearching(null);

  //   queryTokenList("https://api.relay.link", {
  //     limit: 10,
  //     term: isAddress(debouncedTerm) ? undefined : debouncedTerm,
  //     chainIds: activeChainId === 0 ? undefined : [activeChainId],
  //     address: isAddress(debouncedTerm) ? debouncedTerm : undefined,
  //   })
  //     .then((data) => {
  //       if (!cancelled) setSearchTokens(data);
  //     })
  //     .catch((err) => {
  //       if (!cancelled) setErrorSearching(err.message || "Unknown error");
  //     })
  //     .finally(() => {
  //       if (!cancelled) setLoadingSearchList(false);
  //     });

  //   return () => {
  //     cancelled = true;
  //   };
  // }, [debouncedTerm, activeChainId]);

  // const {
  //   data: communityCoins,
  //   isLoading: isLoadingCommunityCoins,
  //   loadCoins: loadCommunityCoins,
  // } = useCommunityCoins();

  // const {
  //   data: solanaTrendingCoins,
  //   isLoading: isLoadingSolanaTrendingCoins,
  //   loadCoins: loadSolanaCoins,
  // } = useSolanaCoins();

  // console.log("solanaTrendingCoins", solanaTrendingCoins);

  // const {
  //   data: geckoTrendingCoins,
  //   isLoading: isLoadingGeckoCoins,
  //   loadTokens: loadGeckoCoinsForChain,
  // } = useGeckoTokens();

  // const [userEthTokens, setUserEthTokens] = useState<UnifiedToken[] | null>(
  //   null
  // );
  // const [nativeSolBalance, setNativeSolBalance] =
  //   useState<SolBalanceResponse | null>(null);

  // const [userSolanaTokens, setUserSolanaTokens] = useState<
  //   UnifiedToken[] | null
  // >(null);
  // // console.log("geckoTrendingCoins", geckoTrendingCoins);

  // // queryTokenList("https://api.relay.link", {
  // //   limit: 20,
  // //   term: "usdc",
  // // });

  // useEffect(() => {
  //   loadGeckoCoinsForChain("base");
  // }, [loadGeckoCoinsForChain]);

  // useEffect(() => {
  //   loadCommunityCoins();
  // }, [loadCommunityCoins]);

  // useEffect(() => {
  //   loadSolanaCoins();
  // }, [loadSolanaCoins]);

  // useEffect(() => {
  //   const solNativeBalance = async () => {
  //     const balance = await getSolBalance(
  //       "8dc4Gk3riGii9sASFB8EuEEJeQ5BruDWPZQW7so55JEp"
  //     );
  //     setNativeSolBalance(balance);
  //   };
  //   const ethCoins = async () => {
  //     const tokens = await getUserEthTokens({
  //       address: "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce",
  //     });
  //     setUserEthTokens(tokens);
  //   };
  //   const solCoins = async () => {
  //     const tokens = await getUserSolTokens({
  //       address: "8dc4Gk3riGii9sASFB8EuEEJeQ5BruDWPZQW7so55JEp",
  //     });
  //     setUserSolanaTokens(tokens);
  //   };
  //   solNativeBalance();
  //   solCoins();
  //   ethCoins();
  // }, []);

  // const nativeTokens = useMemo(
  //   () => userEthTokens?.filter((t) => t.address === zeroAddress) ?? [],
  //   [userEthTokens]
  // );
  // const nonNativeUserEthTokens = useMemo(
  //   () => userEthTokens?.filter((t) => t.address !== zeroAddress) ?? [],
  //   [userEthTokens]
  // );

  // const { chains, isLoading } = useRelayChains();

  // const nonBitcoin = useMemo(
  //   () => (chains ?? []).filter((c) => c.id !== 8253038),
  //   [chains]
  // );
  // const featuredIds = useMemo(
  //   () => new Set<number>([7777777, 42161, 8453, 1, 56, 666666666, 792703809]),
  //   []
  // );

  // // 3. Partition into featured vs others
  // const featuredChains = useMemo(
  //   () => nonBitcoin.filter((c) => featuredIds.has(c.id)),
  //   [nonBitcoin, featuredIds]
  // );
  // const otherChains = useMemo(
  //   () => nonBitcoin.filter((c) => !featuredIds.has(c.id)),
  //   [nonBitcoin, featuredIds]
  // );

  // const solanaChain = useMemo(
  //   () => featuredChains.find((chain) => chain.id === 792703809),
  //   [featuredChains]
  // );
  // const baseChain = useMemo(
  //   () => featuredChains.find((chain) => chain.id === 8453),
  //   [featuredChains]
  // );

  // console.log("geckoTrendingCoins", geckoTrendingCoins);

  // const allTokens = useMemo<UnifiedToken[]>(() => {
  //   const out: UnifiedToken[] = [];

  //   // -- Relay search results --
  //   out.push(
  //     ...searchTokens.map((t) => ({
  //       source: "relay" as const,
  //       chainId: t.chainId,
  //       address: t.address === "native" ? zeroAddress : t.address!,
  //       symbol: t.symbol!,
  //       logo: t.metadata?.logoURI,
  //       priceUsd: undefined,
  //       name: t.name || "Token",
  //     }))
  //   );

  //   // -- your Ethereum balances --
  //   if (userEthTokens) {
  //     out.push(...userEthTokens);
  //   }

  //   // -- native SOL --
  //   if (nativeSolBalance && solanaChain) {
  //     out.push({
  //       source: "sol" as const,
  //       chainId: solanaChain.id,
  //       address: solanaChain.currency!.address as string,
  //       symbol: solanaChain.currency!.symbol as string,
  //       logo: solanaChain.icon!.light,
  //       priceUsd: nativeSolBalance.solUsdPrice as number,
  //       balance: nativeSolBalance.balance,
  //       name: "Solana",
  //     });
  //   }
  //   if (userSolanaTokens) {
  //     out.push(...userSolanaTokens);
  //   }
  //   // -- other Solana tokens --

  //   // -- Farcaster community coins --

  //   if (communityCoins) {
  //     out.push(...communityCoins);
  //   }
  //   if (geckoTrendingCoins) {
  //     out.push(...geckoTrendingCoins);
  //   }
  //   if (solanaTrendingCoins) {
  //     out.push(...solanaTrendingCoins);
  //   }

  //   // -- Gecko trending on Base --

  //   // -- Solana trending --

  //   return out;
  // }, [
  //   searchTokens,
  //   userEthTokens,
  //   nativeSolBalance,
  //   userSolanaTokens,
  //   communityCoins,
  //   geckoTrendingCoins,
  //   solanaTrendingCoins,
  //   solanaChain,
  // ]);

  // console.log("solanaChain", allTokens);

  // const filteredUnique = useMemo(() => {
  //   if (!searchTerm) return [];

  //   const term = searchTerm.toLowerCase();
  //   const seen = new Set<string>();

  //   return allTokens
  //     .filter((t) => {
  //       const matchesTerm =
  //         t.symbol.toLowerCase().includes(term) ||
  //         t.address.toLowerCase().includes(term);

  //       const matchesChain = activeChainId === 0 || t.chainId === activeChainId;

  //       return matchesTerm && matchesChain;
  //     })
  //     .filter((t) => {
  //       if (seen.has(t.address)) {
  //         return false;
  //       }
  //       seen.add(t.address);
  //       return true;
  //     });
  // }, [searchTerm, allTokens, activeChainId]);

  // const ethNativeList = useMemo(() => {
  //   if (!nativeTokens) return [];
  //   return activeChainId === 0
  //     ? nativeTokens
  //     : nativeTokens.filter((t) => t.chainId === activeChainId);
  // }, [nativeTokens, activeChainId]);

  // // same for the “other” ERC-20s
  // const ethOtherList = useMemo(() => {
  //   if (!nonNativeUserEthTokens) return [];
  //   return activeChainId === 0
  //     ? nonNativeUserEthTokens
  //     : nonNativeUserEthTokens.filter((t) => t.chainId === activeChainId);
  // }, [nonNativeUserEthTokens, activeChainId]);

  // const filteredCommunityCoins = useMemo(() => {
  //   if (!communityCoins) return [];
  //   return activeChainId === 0
  //     ? communityCoins
  //     : communityCoins.filter((c) => c.chainId === activeChainId);
  // }, [communityCoins, activeChainId]);

  // console.log("ethNativeList", ethNativeList);

  return (
    <div className="coins-list">
      {/* <ModalChains
        setActiveChainId={setActiveChainId}
        activeChainId={activeChainId}
        otherChains={otherChains}
        featuredChains={featuredChains}
      /> */}

      {/* <div className="chain-sidebar__contianer">
        <label className="chain-sidebar__input">
          <SearchGlass />
          <input
            type="text"
            placeholder="Search Ticker or Address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => setSearchTerm("")}
            className="chain-sidebar__input__abandon"
          >
            <InputCross />
          </button>
        </label>
      </div>
      <div className="modal-native-coins">
        {searchTokens && searchTokens.length > 0 && searchTerm.length > 0 && (
          <div className="modal-native-coins__container">
            <div className="chain-sidebar__header">
              <h2>Search Result</h2>
            </div>
            {filteredUnique.length &&
              filteredUnique.map((t, i) => {
                const chain = chains?.find((c) => c.id === t.chainId);
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={t.balance}
                    priceUsd={t.priceUsd}
                    coinAddress={t.address}
                    coinSymbol={t.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={t.logo}
                    coinName={t.name}
                  />
                );
              })}
          </div>
        )}

        {suggestedTokens &&
          suggestedTokens.length > 0 &&
          !searchTerm.length && (
            <div className="modal-native-coins__featured">
              <div className="modal-native-coins__featured__header">
                <h2>Featured</h2>
              </div>
              {suggestedTokens.map((token, i) => {
                if (!chains) return;

                const chain = chains.find((c) => c.id === token.chainId);

                return (
                  <FeaturedCoinItem
                    key={i}
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.metadata?.logoURI}
                  />
                );
              })}
            </div>
          )}
        {ethNativeList.length > 0 &&
          activeChainId !== 792703809 &&
          !searchTerm.length && (
            <div className="modal-native-coins__container">
              <div className="chain-sidebar__header">
                <h2>Native Ethereum Balance</h2>
                <h2>Balance/Native</h2>
              </div>
              {ethNativeList.map((token, i) => {
                const chain = featuredChains.find(
                  (c) => c.id === token.chainId
                );
                // console.log("token", token);

                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={token.balance}
                    priceUsd={token.priceUsd}
                    coinAddress={
                      token.address === "native"
                        ? zeroAddress
                        : (token.address as string)
                    }
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.logo}
                    coinName={"Ether"}
                  />
                );
              })}
            </div>
          )}
        {nativeSolBalance &&
          nativeSolBalance.balance !== 0 &&
          (activeChainId === 792703809 || activeChainId === 0) &&
          !searchTerm.length && (
            <div className="modal-native-coins__container">
              <div className="chain-sidebar__header">
                <h2>Native Solana Balance</h2>
                <h2>Balance/Native</h2>
              </div>
              {solanaChain &&
                solanaChain?.icon?.light &&
                solanaChain?.icon?.squaredLight &&
                solanaChain.currency?.address &&
                solanaChain.currency?.symbol && (
                  <ModalCoinItem
                    userBalance={nativeSolBalance.balance}
                    priceUsd={nativeSolBalance.solUsdPrice}
                    coinAddress={solanaChain.currency?.address}
                    coinSymbol={solanaChain.currency?.symbol}
                    chainSrc={solanaChain?.icon?.squaredLight}
                    coinSrc={solanaChain?.icon?.light}
                    coinName="Solana"
                  />
                )}
            </div>
          )}

        {ethOtherList.length > 0 &&
          activeChainId !== 792703809 &&
          !searchTerm.length && (
            <div className="modal-native-coins__container">
              <div className="chain-sidebar__header">
                <h2>Other Ethereum Tokens</h2>
                <h2>Balance/Native</h2>
              </div>
              {ethOtherList.map((token, i) => {
                const chain = featuredChains.find(
                  (c) => c.id === token.chainId
                );
                // console.log("token", token);
                // const balanceNative = Number(
                //   applyDecimals(token.amount, token.decimals)
                // ).toFixed(6);
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={token.balance}
                    priceUsd={token.priceUsd}
                    coinAddress={
                      token.address === "native"
                        ? zeroAddress
                        : (token.address as string)
                    }
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.logo}
                    coinName={token.name}
                  />
                );
              })}
            </div>
          )}
        {userSolanaTokens &&
          userSolanaTokens.length > 0 &&
          solanaChain?.icon?.squaredLight &&
          (activeChainId === 792703809 || activeChainId === 0) &&
          !searchTerm.length && (
            <div className="modal-native-coins__container">
              <div className="chain-sidebar__header">
                <h2>Other Solana Tokens</h2>
                <h2>Balance/Native</h2>
              </div>
              {userSolanaTokens.map((token, i) => {
                return (
                  <ModalCoinItem
                    key={i}
                    userBalance={token.balance}
                    priceUsd={token.priceUsd}
                    coinAddress={token.address}
                    coinSymbol={token.symbol}
                    chainSrc={solanaChain?.icon?.squaredLight}
                    coinSrc={token.logo}
                    coinName={token.name}
                  />
                );
              })}
            </div>
          )}
        {!isLoadingCommunityCoins &&
          filteredCommunityCoins.length > 0 &&
          !searchTerm.length && (
            <div className="modal-native-coins__container">
              <div className="chain-sidebar__header">
                <h2>Farcaster Community Coins</h2>
                <h2>Price/Native</h2>
              </div>

              {filteredCommunityCoins.map((token, i) => {
                const chain = featuredChains.find(
                  (c) => c.id === token.chainId
                );
                return (
                  <ModalCoinItem
                    key={i}
                    //  userBalance={token.amount} // if you have balances
                    priceUsd={token.priceUsd}
                    priceNative={token.priceNative}
                    coinAddress={token.address}
                    coinSymbol={token.symbol}
                    chainSrc={chain?.icon?.squaredLight}
                    coinSrc={token.logo}
                    coinName={token.name}
                  />
                );
              })}
            </div>
          )}
        {!isLoadingGeckoCoins &&
          baseChain &&
          geckoTrendingCoins &&
          geckoTrendingCoins.length > 0 &&
          (activeChainId === 0 || activeChainId === 8453) &&
          !searchTerm.length && (
            <div className="modal-native-coins__container">
              <div className="chain-sidebar__header">
                <h2>Base Trending Coins</h2>
                <h2>Price/Native</h2>
              </div>

              {geckoTrendingCoins.map((token, i) => {
                // console.log("base token", token);

                return (
                  <ModalCoinItem
                    key={i}
                    //  userBalance={token.amount}
                    priceUsd={token.priceUsd}
                    priceNative={token.priceNative}
                    coinAddress={token.address}
                    coinSymbol={token.symbol}
                    chainSrc={baseChain?.icon?.squaredLight}
                    coinSrc={token.logo}
                    coinName={token.name}
                  />
                );
              })}
            </div>
          )}
        {!isLoadingSolanaTrendingCoins &&
          solanaTrendingCoins &&
          solanaTrendingCoins.length > 0 &&
          (activeChainId === 792703809 || activeChainId === 0) &&
          !searchTerm.length && (
            <div className="modal-native-coins__container">
              <div className="chain-sidebar__header">
                <h2>Solana Trending Coins</h2>
                <h2>Price/Native</h2>
              </div>

              {solanaTrendingCoins.map((token, i) => {
                return (
                  <ModalCoinItem
                    key={i}
                    priceUsd={token.priceUsd}
                    priceNative={token.priceNative}
                    coinAddress={token.address}
                    coinSymbol={token.symbol}
                    chainSrc={solanaChain?.icon?.squaredLight}
                    coinSrc={token.logo}
                    coinName={token.name}
                  />
                );
              })}
            </div>
          )}
      </div> */}
    </div>
  );
}

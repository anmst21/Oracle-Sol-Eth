"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  restNetworksImg,
  geckoNetworks,
  GeckoNetwork,
  Token,
} from "@/helpers/geckoNetworks";
import { Chain, degen, zora } from "viem/chains";
import { Coin } from "../icons";
import { queryTokenList } from "@reservoir0x/relay-kit-hooks";

import Image from "next/image";
import { MergedToken } from "@/types/GeckoTerminalCoins";
import { FormattedCoin } from "@/types/CommunityCoins";
import { DexScreenerTokenMeta } from "@/types/SolanaCoins";
import CoinsSection from "./coins-section";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchTokensForChain } from "@/actions/fetch-tokens-for-chain";

type ModalChain = (GeckoNetwork | Chain) | null;
interface TokenModalProps {
  geckoCoins: MergedToken[] | null;
  communityCoins: FormattedCoin[] | null;
  solanaCoins: DexScreenerTokenMeta[] | null;
}
const TokenModal: React.FC<TokenModalProps> = ({
  geckoCoins,
  communityCoins,
  solanaCoins,
}) => {
  const [tokens, setTokens] = useState<MergedToken[] | Token[]>([]);

  const ethNetworks = [degen, zora];
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const chain = searchParams.get("chain");

  const initialChain = () => {
    if (chain === "degen") {
      return degen;
    } else if (chain === "zora") {
      return zora;
    } else if (chain === undefined) {
      return null;
    } else {
      return (
        geckoNetworks.find(({ id }: { id: string }) => id === chain) ?? null
      );
    }
  };

  const [selectedChain, setSelectedChain] = useState<ModalChain>(initialChain);

  const isDexUnsupportedChain =
    selectedChain &&
    "name" in selectedChain &&
    (selectedChain.id === 7777777 || selectedChain.id === 666666666);

  useEffect(() => {
    if (!chain || chain === "base" || chain === "solana") return;

    if ((chain === "zora" || chain === "degen") && isDexUnsupportedChain) {
      const fetchRareTokens = async () => {
        const suggestedTokens = await queryTokenList("https://api.relay.link", {
          defaultList: true,
          limit: 20,
          // term: "usdc",

          chainIds: [selectedChain.id],
        });

        const flattenedArray: Token[] = suggestedTokens?.flat();
        setTokens(flattenedArray);
      };
      fetchRareTokens();
      return;
    }

    const fetchTokens = async () => {
      try {
        const fetchedTokens = await fetchTokensForChain(chain);
        setTokens(fetchedTokens ? fetchedTokens : []);
      } catch (error) {
        console.error("Error fetching tokens:", error);
      }
    };

    fetchTokens();
  }, [chain]);

  console.log("tokens", tokens);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const onPressChain = (chain: ModalChain) => {
    if (tokens.length > 0) setTokens([]);

    setSelectedChain(chain);

    if (chain && "type" in chain) {
      router.push(pathname + "?" + createQueryString("chain", chain.id));
    } else if (chain && "name" in chain) {
      router.push(
        pathname +
          "?" +
          createQueryString("chain", chain.name.toLocaleLowerCase())
      );
    } else if (!chain) {
      router.push(pathname);
    }
  };
  console.log("ethNetworks", geckoNetworks, ethNetworks);

  return (
    <div className="token-modal">
      <div className="token-modal__box">
        <div className="token-modal__chains">
          <button onClick={() => onPressChain(null)} className="modal-chain">
            {/* <Image
              width={24}
              height={24}
              src={network.img}
              alt={network.attributes.name}
            /> */}
            <Coin />
            <span>Explore</span>
          </button>
          {geckoNetworks.map((network) => {
            return (
              <button
                onClick={() => onPressChain(network)}
                className="modal-chain"
                key={network.numId}
              >
                <Image
                  width={24}
                  height={24}
                  src={network.img}
                  alt={network.attributes.name}
                />
                <span>{network.attributes.name.split(" ")[0]}</span>
              </button>
            );
          })}

          {ethNetworks.map((network) => {
            return (
              <button
                onClick={() => onPressChain(network)}
                className="modal-chain"
                key={network.id}
              >
                <Image
                  width={24}
                  height={24}
                  src={restNetworksImg[network.id]}
                  alt={network.name}
                />
                <span>{network.name}</span>
              </button>
            );
          })}
        </div>
        <div className="token-modal__main">
          {!chain && (
            <>
              <CoinsSection
                sectionType="gecko"
                coinsArray={geckoCoins}
                sectionName="Top on Base"
              />
              <CoinsSection
                sectionType="solana"
                coinsArray={solanaCoins}
                sectionName="Top on Solana"
              />
              <CoinsSection
                sectionType="community"
                coinsArray={communityCoins}
                sectionName="Top on Warpcast"
              />
            </>
          )}
          {chain === "base" && (
            <CoinsSection
              sectionType="gecko"
              coinsArray={geckoCoins}
              sectionName="Top on Base"
            />
          )}
          {chain === "solana" && (
            <CoinsSection
              sectionType="solana"
              coinsArray={solanaCoins}
              sectionName="Top on Solana"
            />
          )}

          {chain &&
            selectedChain &&
            "attributes" in selectedChain &&
            selectedChain?.id !== "solana" &&
            selectedChain?.id !== "base" && (
              <CoinsSection
                sectionType="gecko"
                coinsArray={tokens}
                sectionName={`Top on ${selectedChain?.attributes?.name}`}
              />
            )}
          {chain && isDexUnsupportedChain && (
            <CoinsSection
              sectionType="relay"
              coinsArray={tokens}
              sectionName={`Top on ${selectedChain?.name}`}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenModal;

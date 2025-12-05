import React, { useMemo, Dispatch, SetStateAction } from "react";
import { ChainValues } from "./types";
import ChartChainItem from "./chart-chain-item";
import { RelayChainFetch } from "@/types/relay-chain";
type Props = {
  chains: ChainValues;
  activeChain: RelayChainFetch | null;
  setChainId: Dispatch<SetStateAction<number>>;
  date: string;
};

const ChartLine = ({ chains, activeChain, setChainId, date }: Props) => {
  const chainsArray = useMemo(() => {
    return Object.entries(chains).map(([chain, value]) => ({
      chain,
      value,
    }));
  }, [chains]);

  return (
    <div className="chart-line">
      {chainsArray.map((data, index) => {
        if (data.value! < 1000) return;
        return (
          <ChartChainItem
            date={date}
            setChainId={setChainId}
            data={data}
            activeChain={activeChain}
            key={index}
          />
        );
      })}
    </div>
  );
};

export default ChartLine;

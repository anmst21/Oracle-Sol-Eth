import {
  useRef,
  useEffect,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
} from "react";
import classNames from "classnames";
import { CHART_COLORS } from "./colors";
import { useRelayChains } from "@reservoir0x/relay-kit-hooks";
import { RelayChainFetch } from "@/types/relay-chain";
import { AnimatePresence } from "motion/react";
import LineModal from "./line-modal";
import { useIsDesktop } from "@/hooks/useIsDesktop";

type Props = {
  data: {
    chain: string;
    value: number | undefined;
  };
  activeChain: RelayChainFetch | null;
  setChainId: Dispatch<SetStateAction<number>>;
  date: string;
};

const MAX_VOLUME = 8_500_000;

const getHeightPercent = (value: number) => {
  const ratio = Math.min(value / MAX_VOLUME, 1);
  return `${ratio * 100}%`;
};

const ChartChainItem = ({ activeChain, data, setChainId, date }: Props) => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [elHeight, setElHeight] = useState(0);
  const lineRef = useRef<HTMLDivElement | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [isLeft, setIsLeft] = useState(true);
  const [modalChain, setModalChain] = useState<RelayChainFetch | null>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;

    // setIsLeft(el.offsetLeft <= width / 2);
    const height = el.clientHeight;
    setElHeight(height);
  }, [width]);

  const { chains } = useRelayChains();

  // const hoverChain = useMemo(
  //   () =>,
  //   [chains, data]
  // );

  const onClick = useCallback(
    (chainName: string) => {
      const chainId =
        chains?.find((chain) => chain.name === chainName)?.id || 0;
      setChainId(chainId);
    },
    [setChainId, chains]
  );

  const isDesktop = useIsDesktop();
  const isLeftSideMargin = isDesktop ? 340 : 0;

  const onHover = (value: boolean, chainName: string, margin: number) => {
    const el = lineRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const viewportCenterX = window.innerWidth / 2;

    const isLeftSide = elementCenterX < viewportCenterX - margin / 2;

    setIsLeft(isLeftSide);

    setModalChain(
      chains?.find((chain) => chain.name === chainName) as RelayChainFetch
    );
    setShowModal(value);
  };

  return (
    <div
      ref={lineRef}
      style={{
        // minHeight: ,
        // width: 3,
        height: getHeightPercent(data.value!),
        color: CHART_COLORS[data.chain as keyof typeof CHART_COLORS],
      }}
      className={classNames("chart-line__item", {
        "chart-line__item--choice": activeChain !== null,
        "chart-line__item--active": activeChain?.name === data.chain,
      })}
      onClick={() => onClick(data.chain)}
      onMouseEnter={() => onHover(true, data.chain, isLeftSideMargin)}
      onMouseLeave={() => onHover(false, data.chain, isLeftSideMargin)}
    >
      {elHeight >= 12 && <div className="chart-line__item__circle" />}
      <AnimatePresence mode="wait">
        {showModal && modalChain && (
          <LineModal
            date={date}
            value={data.value}
            callback={() => (onClick(data.chain), setShowModal(false))}
            modalChain={modalChain}
            isLeft={isLeft}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChartChainItem;

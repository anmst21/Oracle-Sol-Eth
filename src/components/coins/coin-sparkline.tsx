import React, { useMemo } from "react";

type Props = {
  data: { price: string; date: number }[];
  width?: number;
  height?: number;
};

const CoinSparkline = ({ data, width = 80, height = 24 }: Props) => {
  const { points, color } = useMemo(() => {
    if (!data || data.length < 2) return { points: "", color: "#889697" };

    const prices = data.map((d) => Number(d.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const pts = prices
      .map((p, i) => {
        const x = (i / (prices.length - 1)) * width;
        const y = height - ((p - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    const c = prices[prices.length - 1] >= prices[0] ? "#AEE900" : "#F13D20";

    return { points: pts, color: c };
  }, [data, width, height]);

  if (!points) return null;

  return (
    <svg
      className="coin-sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CoinSparkline;

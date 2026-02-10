import { formatUnits, parseUnits } from "viem/utils";

type RelayPriceParams = {
  originChainId: number;
  originCurrency: string;
  destinationChainId: number;
  destinationCurrency: string;
  amount: string;
  originDecimals: number;
};

type RelayPriceStep = {
  items?: { data?: { amountOut?: string; currencyOut?: { decimals?: number } } }[];
};

type RelayPriceResponse = {
  steps?: RelayPriceStep[];
};

export async function fetchRelayPrice({
  originChainId,
  originCurrency,
  destinationChainId,
  destinationCurrency,
  amount,
  originDecimals,
}: RelayPriceParams): Promise<string | null> {
  const amountWei = parseUnits(amount, originDecimals).toString();

  const res = await fetch("https://api.relay.link/price", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      originChainId,
      originCurrency,
      destinationChainId,
      destinationCurrency,
      value: amountWei,
      user: "0x0000000000000000000000000000000000000001",
      recipient: "0x0000000000000000000000000000000000000001",
    }),
  });

  if (!res.ok) return null;

  const data = (await res.json()) as RelayPriceResponse;

  const step = data.steps?.[data.steps.length - 1];
  const item = step?.items?.[0];
  const amountOut = item?.data?.amountOut;
  const decimals = item?.data?.currencyOut?.decimals;

  if (!amountOut || decimals == null) return null;

  return formatUnits(BigInt(amountOut), decimals);
}

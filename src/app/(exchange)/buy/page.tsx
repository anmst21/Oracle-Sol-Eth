import { Metadata } from "next";
import { headers } from "next/headers";
import { fetchCoinbaseBuyOptions } from "@/actions/fetch-coinbase-buy-options";
import BuyWindow from "@/components/buy";

export const metadata: Metadata = {
  title: "Buy Crypto",
  description:
    "Buy crypto with fiat currency using Coinbase Onramp. Purchase SOL, ETH, and more with your local currency — fast, secure, and directly into your wallet.",
  openGraph: {
    title: "Buy Crypto | Oracle",
    description:
      "Buy crypto with fiat currency using Coinbase Onramp. Purchase SOL, ETH, and more directly into your wallet.",
    url: "https://oracleswap.app/buy",
  },
};

export default async function Page() {
  const headersList = await headers();
  const country = headersList.get("x-vercel-ip-country") ?? "US";

  const { fiatCurrencies, purchaseCurrencies, isSupported } =
    await fetchCoinbaseBuyOptions(country);

  return (
    <div className="buy-page">
      <BuyWindow
        country={country}
        fiatCurrencies={fiatCurrencies}
        purchaseCurrencies={purchaseCurrencies}
        isSupported={isSupported}
      />
    </div>
  );
}

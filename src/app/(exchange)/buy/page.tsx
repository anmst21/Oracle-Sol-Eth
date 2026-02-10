import { Metadata } from "next";
import { fetchMoonpayCountries } from "@/actions/fetch-moonpay-countries";
import { fetchMoonpayCurrencies } from "@/actions/fetch-moonpay-currencies";
import { fetchMoonpayIp } from "@/actions/fetch-moonpay-ip";
import BuyWindow from "@/components/buy";

export const metadata: Metadata = {
  title: "Buy Crypto",
  description:
    "Buy crypto with fiat currency using MoonPay. Purchase SOL, ETH, and more with your local currency — fast, secure, and directly into your wallet.",
  openGraph: {
    title: "Buy Crypto | Oracle",
    description:
      "Buy crypto with fiat currency using MoonPay. Purchase SOL, ETH, and more directly into your wallet.",
    url: "https://oracleswap.app/buy",
  },
};

export default async function Page() {
  // const [visible, setVisible] = useState(false);
  const moonpayIp = await fetchMoonpayIp();

  const moonpayCurrencies = await fetchMoonpayCurrencies();

  const countries = await fetchMoonpayCountries();

  return (
    <div className="buy-page">
      <BuyWindow
        countries={countries}
        fiatCurrencies={moonpayCurrencies.fiat}
        moonpayIp={moonpayIp}
      />
      {/* <div className="buy-widget">
        <div className="buy-widget__header">
          <span>Enter the amount</span>
        </div>
        <BuyInput />
        <TokenToBuy />
        <RecipientWindow />
      </div> */}

      {/* <MoonPayBuyWidget
        variant="embedded"
        baseCurrencyCode="usd"
        baseCurrencyAmount="100"
        defaultCurrencyCode="sol"
        visible={visible}
        showAllCurrencies="true"
      />
      <button onClick={() => setVisible(!visible)}>Toggle widget</button> */}
    </div>
  );
}

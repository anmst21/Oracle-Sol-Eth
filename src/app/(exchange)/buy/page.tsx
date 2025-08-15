// "use client";

// import BuyInput from "@/components/buy/buy-input";
// import TokenToBuy from "@/components/buy/token-to-buy";
// import RecipientWindow from "@/components/buy/recipient-window";
import { fetchMoonpayCountries } from "@/actions/fetch-moonpay-countries";
import { fetchMoonpayCurrencies } from "@/actions/fetch-moonpay-currencies";
import { fetchMoonpayIp } from "@/actions/fetch-moonpay-ip";
import BuyWindow from "@/components/buy";

// const MoonPayBuyWidget = dynamic(
//   () => import("@moonpay/moonpay-react").then((mod) => mod.MoonPayBuyWidget),
//   { ssr: false }
// );

export default async function Page() {
  // const [visible, setVisible] = useState(false);
  const moonpayIp = await fetchMoonpayIp();

  const moonpayCurrencies = await fetchMoonpayCurrencies();

  const countries = await fetchMoonpayCountries();

  return (
    <div className="buy-page">
      <BuyWindow
        countries={countries}
        cryptoCurrencies={moonpayCurrencies.crypto}
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

import { MoonpayFiatCurrency } from "@/types/moonpay-api";

export const usdCurrency: MoonpayFiatCurrency = {
  id: "edd81f1f-f735-4692-b410-6def107f17d2",
  createdAt: "2019-04-29T16:55:28.647Z",
  updatedAt: "2024-11-26T13:40:31.967Z",
  type: "fiat",
  name: "US Dollar",
  code: "usd",
  precision: 2,
  decimals: null,
  icon: "https://static.moonpay.com/widget/currencies/usd.svg",
  maxAmount: 12000,
  minAmount: 30,
  minBuyAmount: 20,
  maxBuyAmount: 30000,
  isSellSupported: true,
  isUtxoCompatible: false,
};

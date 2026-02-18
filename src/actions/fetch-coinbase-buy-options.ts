"use server";

import { generateCoinbaseJwt } from "./coinbase-jwt";
import {
  CoinbaseBuyOptionsResponse,
  CoinbasePurchaseCurrency,
  OnrampFiatCurrency,
} from "@/types/coinbase-onramp";

/** Static map of fiat currency names (Coinbase only returns IDs + limits) */
const FIAT_NAMES: Record<string, string> = {
  USD: "US Dollar", EUR: "Euro", GBP: "British Pound", CAD: "Canadian Dollar",
  AUD: "Australian Dollar", JPY: "Japanese Yen", CHF: "Swiss Franc",
  BRL: "Brazilian Real", MXN: "Mexican Peso", INR: "Indian Rupee",
  KRW: "South Korean Won", SGD: "Singapore Dollar", HKD: "Hong Kong Dollar",
  NZD: "New Zealand Dollar", SEK: "Swedish Krona", NOK: "Norwegian Krone",
  DKK: "Danish Krone", PLN: "Polish Zloty", TRY: "Turkish Lira",
  ZAR: "South African Rand", CZK: "Czech Koruna", THB: "Thai Baht",
  TWD: "New Taiwan Dollar", PHP: "Philippine Peso", ILS: "Israeli Shekel",
  CLP: "Chilean Peso", ARS: "Argentine Peso", COP: "Colombian Peso",
  PEN: "Peruvian Sol", AED: "UAE Dirham", AZN: "Azerbaijani Manat",
  BGN: "Bulgarian Lev", HUF: "Hungarian Forint", RON: "Romanian Leu",
  HRK: "Croatian Kuna", ISK: "Icelandic Krona", RUB: "Russian Ruble",
  UAH: "Ukrainian Hryvnia", GEL: "Georgian Lari", NGN: "Nigerian Naira",
  KES: "Kenyan Shilling", GHS: "Ghanaian Cedi", IDR: "Indonesian Rupiah",
  MYR: "Malaysian Ringgit", VND: "Vietnamese Dong", PKR: "Pakistani Rupee",
  BDT: "Bangladeshi Taka", EGP: "Egyptian Pound", MAD: "Moroccan Dirham",
  QAR: "Qatari Riyal", SAR: "Saudi Riyal", KWD: "Kuwaiti Dinar",
  BHD: "Bahraini Dinar", OMR: "Omani Rial", JOD: "Jordanian Dinar",
  LKR: "Sri Lankan Rupee", CRC: "Costa Rican Colon", UYU: "Uruguayan Peso",
  DOP: "Dominican Peso", GTQ: "Guatemalan Quetzal", PYG: "Paraguayan Guarani",
  BOB: "Bolivian Boliviano", TTD: "Trinidad Dollar", JMD: "Jamaican Dollar",
  KZT: "Kazakhstani Tenge", UZS: "Uzbekistani Som", MDL: "Moldovan Leu",
  ALL: "Albanian Lek", MKD: "Macedonian Denar", RSD: "Serbian Dinar",
  BAM: "Bosnia Mark", CNY: "Chinese Yuan",
};

/** Derive flag icon from currency code: first 2 chars = country alpha-2 */
function flagIcon(currencyCode: string): string {
  const alpha2 = currencyCode.slice(0, 2).toLowerCase();
  return `https://flagcdn.com/${alpha2}.svg`;
}

export interface BuyOptionsResult {
  fiatCurrencies: OnrampFiatCurrency[];
  purchaseCurrencies: CoinbasePurchaseCurrency[];
  isSupported: boolean;
}

export async function fetchCoinbaseBuyOptions(
  country: string
): Promise<BuyOptionsResult> {
  const basePath = "/onramp/v1/buy/options";
  const fullPath = `${basePath}?country=${encodeURIComponent(country)}`;
  const jwt = await generateCoinbaseJwt("GET", basePath);

  const baseUrl = process.env.NEXT_PUBLIC_COINBASE_SANDBOX === "true"
    ? "https://api.developer.coinbase.com"
    : "https://api.developer.coinbase.com";

  const res = await fetch(`${baseUrl}${fullPath}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Coinbase buy options error:", res.status, text);
    return { fiatCurrencies: [], purchaseCurrencies: [], isSupported: false };
  }

  const data: CoinbaseBuyOptionsResponse = await res.json();

  const fiatCurrencies: OnrampFiatCurrency[] = data.payment_currencies.map(
    (pc) => {
      const code = pc.id.toUpperCase();
      const cardLimit = pc.limits.find(
        (l) => l.id === "CARD" || l.id === "card"
      );
      return {
        id: pc.id,
        code: pc.id.toLowerCase(),
        name: FIAT_NAMES[code] ?? code,
        icon: flagIcon(code),
        minBuyAmount: cardLimit ? parseFloat(cardLimit.min) : 20,
        maxBuyAmount: cardLimit ? parseFloat(cardLimit.max) : 10000,
      };
    }
  );

  return {
    fiatCurrencies,
    purchaseCurrencies: data.purchase_currencies,
    isSupported: data.purchase_currencies.length > 0,
  };
}

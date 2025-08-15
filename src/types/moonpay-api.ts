export type MoonpayIpResponse = {
  alpha2: string;
  alpha3: string;
  country: string;
  state: string;
  ipAddress: string;
  isAllowed: boolean;
  isBuyAllowed: boolean;
  isNftAllowed: boolean;
  isSellAllowed: boolean;
  isBalanceLedgerWithdrawAllowed: boolean;
  isFiatBalanceAllowed: boolean;
  isMoonPayBalanceAllowed: boolean;
  isLowLimitEnabled: boolean;
};

export interface MoonpayBaseCurrency {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: "fiat" | "crypto";
  name: string;
  code: string;
  precision: number;
  minBuyAmount: number;
  maxBuyAmount: number;
  isSellSupported: boolean;
}

export interface MoonpayFiatCurrency extends MoonpayBaseCurrency {
  type: "fiat";
}

export interface MoonpayCryptoCurrency extends MoonpayBaseCurrency {
  type: "crypto";
  minSellAmount: number;
  maxSellAmount: number;
  addressRegex: string;
  testnetAddressRegex: string;
  supportsAddressTag: boolean;
  addressTagRegex: string | null;
  supportsTestMode: boolean;
  isSuspended: boolean;
  isSupportedInUs: boolean;
  notAllowedUSStates: string[];
  notAllowedCountries: string[];
  metadata: {
    contractAddress: string | number;
    chainId: string;
    networkCode: string;
  };
}

export interface MoonpayCurrenciesSplit {
  fiat: MoonpayFiatCurrency[];
  crypto: MoonpayCryptoCurrency[];
}

export type MoonpaySupportedDocument =
  | "additional_proof_of_income"
  | "driving_licence"
  | "national_identity_card"
  | "passport"
  | "proof_of_address"
  | "proof_of_income"
  | "residence_permit"
  | "selfie";

/**
 * MoonPay Countries entry
 */
export interface MoonpayCountry {
  alpha2: string; // e.g., "GB"
  alpha3: string; // e.g., "GBR"
  name: string; // e.g., "United Kingdom"
  isAllowed: boolean;
  isBuyAllowed: boolean;
  isSellAllowed: boolean;
  supportedDocuments: MoonpaySupportedDocument[];
}

export type MoonpayCountriesResponse = MoonpayCountry[];

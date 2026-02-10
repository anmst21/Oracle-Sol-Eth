import { MoonpayCryptoCurrency } from "@/types/moonpay-api";
import { UnifiedToken } from "@/types/coin-types";
import { getMoonpayChainId } from "./moonpay-chain-map";

/**
 * Find the MoonPay currency code for a token.
 * For ORACLE route tokens (source !== "moonpay"), returns "eth_base".
 */
export function getMoonpayCode(
  token: UnifiedToken,
  moonpayCryptos: MoonpayCryptoCurrency[]
): string | null {
  if (token.source !== "moonpay") return "eth_base";

  const match = moonpayCryptos.find((c) => {
    const chainId = getMoonpayChainId(c.metadata.networkCode);
    const addr = String(c.metadata.contractAddress).toLowerCase();
    return (
      chainId === token.chainId &&
      addr === token.address.toLowerCase()
    );
  });

  return match?.code ?? null;
}

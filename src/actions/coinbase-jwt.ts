"use server";

import { SignJWT, importPKCS8 } from "jose";
import crypto from "crypto";

/**
 * Generate a JWT for authenticating with Coinbase Onramp API.
 * Matches the exact format from the official CDP SDK.
 */
export async function generateCoinbaseJwt(
  method: string,
  path: string
): Promise<string> {
  const keyName = process.env.CDP_API_KEY_NAME;
  const keySecret = process.env.CDP_API_KEY_SECRET;

  if (!keyName || !keySecret) {
    throw new Error("Missing CDP_API_KEY_NAME or CDP_API_KEY_SECRET env vars");
  }

  const host = "api.developer.coinbase.com";

  // Convert escaped \n to real newlines
  let pemKey = keySecret.replace(/\\n/g, "\n");

  // Coinbase provides SEC1 format (BEGIN EC PRIVATE KEY).
  // jose.importPKCS8 needs PKCS#8 (BEGIN PRIVATE KEY), so convert.
  if (pemKey.includes("BEGIN EC PRIVATE KEY")) {
    const keyObject = crypto.createPrivateKey({ key: pemKey, format: "pem" });
    pemKey = keyObject.export({ type: "pkcs8", format: "pem" }) as string;
  }

  const ecKey = await importPKCS8(pemKey, "ES256");

  const now = Math.floor(Date.now() / 1000);
  const nonce = crypto.randomBytes(16).toString("hex");

  const jwt = await new SignJWT({
    sub: keyName,
    iss: "cdp",
    uris: [`${method} ${host}${path}`],
  })
    .setProtectedHeader({
      alg: "ES256",
      kid: keyName,
      typ: "JWT",
      nonce,
    })
    .setIssuedAt(now)
    .setNotBefore(now)
    .setExpirationTime(now + 120)
    .sign(ecKey);

  return jwt;
}

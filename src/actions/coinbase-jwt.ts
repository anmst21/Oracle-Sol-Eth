"use server";

import { SignJWT, importPKCS8 } from "jose";
import crypto from "crypto";

// PKCS#8 header for EC P-256 (secp256r1) keys
// This wraps a SEC1 EC key body into PKCS#8 format without using crypto.createPrivateKey
const PKCS8_EC_P256_PREFIX = Buffer.from(
  "302e020100300506032b656e04220420",
  "hex"
);

function sec1ToPkcs8Pem(sec1Pem: string): string {
  // Decode SEC1 PEM to DER
  const b64 = sec1Pem
    .replace(/-----BEGIN EC PRIVATE KEY-----/, "")
    .replace(/-----END EC PRIVATE KEY-----/, "")
    .replace(/\s/g, "");
  const sec1Der = Buffer.from(b64, "base64");

  // For EC P-256, the SEC1 structure contains the private key.
  // We need the raw 32-byte private key value from the SEC1 ASN.1 structure.
  // SEC1 format: SEQUENCE { INTEGER version, OCTET STRING privateKey, [0] parameters, [1] publicKey }
  // Parse the OCTET STRING that contains the 32-byte private key
  let offset = 0;
  // Skip outer SEQUENCE tag + length
  if (sec1Der[offset] !== 0x30) throw new Error("Invalid SEC1: expected SEQUENCE");
  offset++;
  if (sec1Der[offset] & 0x80) offset += (sec1Der[offset] & 0x7f) + 1;
  else offset++;
  // Skip INTEGER version (should be 1)
  if (sec1Der[offset] !== 0x02) throw new Error("Invalid SEC1: expected INTEGER");
  offset++;
  const versionLen = sec1Der[offset];
  offset += 1 + versionLen;
  // Read OCTET STRING (the raw private key)
  if (sec1Der[offset] !== 0x04) throw new Error("Invalid SEC1: expected OCTET STRING");
  offset++;
  const keyLen = sec1Der[offset];
  offset++;
  const rawKey = sec1Der.subarray(offset, offset + keyLen);

  // Build PKCS#8 wrapper:
  // SEQUENCE {
  //   INTEGER 0 (version)
  //   SEQUENCE { OID ecPublicKey, OID prime256v1 }
  //   OCTET STRING { SEQUENCE { INTEGER 1, OCTET STRING <rawKey> } }
  // }
  const ecOid = Buffer.from("06072a8648ce3d0201", "hex");     // OID 1.2.840.10045.2.1 (ecPublicKey)
  const p256Oid = Buffer.from("06082a8648ce3d030107", "hex");  // OID 1.2.840.10045.3.1.7 (prime256v1)

  // Inner SEC1 structure (just version + private key, no params/pubkey)
  const innerOctetString = Buffer.concat([
    Buffer.from([0x04, rawKey.length]),
    rawKey,
  ]);
  const innerSeq = Buffer.concat([
    Buffer.from([0x30, 2 + 1 + innerOctetString.length]),
    Buffer.from([0x02, 0x01, 0x01]), // INTEGER 1 (version)
    innerOctetString,
  ]);
  const outerOctetString = Buffer.concat([
    Buffer.from([0x04, innerSeq.length]),
    innerSeq,
  ]);

  // Algorithm identifier: SEQUENCE { ecPublicKey OID, prime256v1 OID }
  const algId = Buffer.concat([
    Buffer.from([0x30, ecOid.length + p256Oid.length]),
    ecOid,
    p256Oid,
  ]);

  // Version INTEGER 0
  const version = Buffer.from([0x02, 0x01, 0x00]);

  // Outer SEQUENCE
  const body = Buffer.concat([version, algId, outerOctetString]);
  const pkcs8Der = Buffer.concat([
    Buffer.from([0x30, body.length]),
    body,
  ]);

  // Encode as PEM
  const b64Out = pkcs8Der.toString("base64");
  const lines = b64Out.match(/.{1,64}/g) || [];
  return `-----BEGIN PRIVATE KEY-----\n${lines.join("\n")}\n-----END PRIVATE KEY-----`;
}

/**
 * Generate a JWT for authenticating with Coinbase Onramp API.
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
  // jose.importPKCS8 needs PKCS#8 (BEGIN PRIVATE KEY), so convert
  // using pure JS DER manipulation (avoids OpenSSL 3.x compat issues).
  if (pemKey.includes("BEGIN EC PRIVATE KEY")) {
    pemKey = sec1ToPkcs8Pem(pemKey);
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

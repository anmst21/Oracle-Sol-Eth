import { Section, Row, Column, Img, Link, Text } from "@react-email/components";

export default function EmailFooter() {
  const uriStyle = {
    textAlign: "end",
    fontFamily: "'Funnel Sans', Arial, sans-serif",
    textDecoration: "underline",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 400,
    color: "#889697",
  } as const;

  return (
    <Section style={{ maxWidth: 820, marginTop: 20, marginBottom: 60 }}>
      <Row>
        <Column colSpan={4}>
          <Link href="https://oracleswap.app/">
            <Img
              style={{ overflow: "hidden", marginTop: 10 }}
              alt="Oracle Email logo"
              height={15.49}
              src="https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/oracleswap/logo-mail.png"
            />
          </Link>
          <Text
            style={{
              marginTop: 20,
              marginBottom: 8,
              fontSize: 21,
              fontFamily: "'Funnel Display', Arial, sans-serif",
              lineHeight: "24px",
              fontWeight: 600,
              color: "#D9F1E9",
            }}
          >
            Oracle
          </Text>
          <Text
            style={{
              marginTop: 16,
              marginBottom: "0px",
              fontSize: 14,
              fontWeight: 500,
              lineHeight: "19px",
              color: "#889697",
              fontFamily: "'Funnel Sans', Arial, sans-serif",
            }}
          >
            Your signal through the noise.
          </Text>
        </Column>
        <Column
          align="right"
          style={{ display: "table-cell", verticalAlign: "bottom" }}
        >
          <Row
            style={{
              display: "table-cell",
              height: 44,
              width: 56,
              verticalAlign: "bottom",
            }}
          >
            <Column style={{ paddingRight: 8 }}>
              <Link href="https://www.linkedin.com/company/n3xus-nyc/">
                <Img
                  alt="X"
                  height="36"
                  src="https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/oracleswap/social-x-lg.png"
                  width="36"
                  style={{ borderRadius: 5 }}
                />
              </Link>
            </Column>
            <Column style={{ paddingRight: 8 }}>
              <Link href="https://x.com/0xN3XUS">
                <Img
                  alt="LinkedIn"
                  height="36"
                  src="https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/oracleswap/social-l-lg.png"
                  width="36"
                  style={{ borderRadius: 5 }}
                />
              </Link>
            </Column>
            <Column>
              <Link href="https://warpcast.com/ragingincel.eth">
                <Img
                  alt="Farcaster"
                  height="36"
                  src="https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/oracleswap/social-f-lg.png"
                  width="36"
                  style={{ borderRadius: 5 }}
                />
              </Link>
            </Column>
          </Row>
          <Row align="right">
            <Text
              style={{
                marginTop: 8,
                marginBottom: 8,
                fontSize: 16,
                lineHeight: "24px",
                fontWeight: 400,
                color: "#889697",
                fontFamily: "'Funnel Sans', Arial, sans-serif",

                textAlign: "end",
              }}
            >
              99 Hudson St, New York, NY 10013, USA
            </Text>
            <Text
              style={{
                marginTop: 4,
                marginBottom: "0px",
              }}
            >
              <Link style={uriStyle} href="mailto:support@oracleswap.app">
                support@oracleswap.app
              </Link>
              {"  "}
              <Link style={uriStyle} href="tel:+1(845)332-40-43">
                +1(845)332-40-43
              </Link>
            </Text>
          </Row>
        </Column>
      </Row>
    </Section>
  );
}

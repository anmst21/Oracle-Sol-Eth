import { Section, Row, Column, Img, Link } from "@react-email/components";

export default function EmailHeader() {
  return (
    <Section
      style={{
        maxWidth: 820,
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: 0,
        marginBottom: 30,
      }}
    >
      <Row style={{ fontWeight: 400 }}>
        <Column style={{ width: "80%" }}>
          <Link href="https://oracleswap.app/">
            <Img
              style={{ overflow: "hidden" }}
              alt="Oracle Email logo"
              height={15.49}
              src="https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/oracleswap/logo-mail.png"
            />
          </Link>
        </Column>

        <Column align="right">
          <Row align="right">
            <Column style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Link
                href="https://oracleswap.app/swap"
                style={{
                  //   fontWeight: 400,
                  fontFamily: "'Funnel Sans', Arial, sans-serif",
                  color: "#889697",

                  textDecoration: "none",
                }}
              >
                Swap
              </Link>
            </Column>
            <Column style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Link
                href="https://oracleswap.app/contacts"
                style={{
                  fontFamily: "'Funnel Sans', Arial, sans-serif",
                  color: "#889697",

                  textDecoration: "none",
                }}
              >
                Contacts
              </Link>
            </Column>
            <Column style={{ paddingLeft: 10, paddingRight: 10 }}>
              <Link
                href="https://oracleswap.app/privacy"
                style={{
                  fontFamily: "'Funnel Sans', Arial, sans-serif",
                  color: "#889697",

                  textDecoration: "none",
                }}
              >
                Privacy
              </Link>
            </Column>
          </Row>
        </Column>
      </Row>
    </Section>
  );
}

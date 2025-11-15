import {
  Section,
  Img,
  Html,
  Head,
  Font,
  Text,
  Heading,
  Body,
} from "@react-email/components";
import * as React from "react";
import Footer from "./footer";
import Divider from "./divider";
import Header from "./header";

export default function WelcomingEmail() {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Funnel Display"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/funneldisplay/v3/B50WF7FGv37QNVWgE0ga--4Pbb6dDYs0gnHA.woff2",
            format: "woff2",
          }}
          fontWeight={500}
          fontStyle="normal"
        />

        <Font
          fontFamily="Funnel Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/funnelsans/v3/OpNIno8Dg9bX6Bsp3Wq69TpyfhjoyU7d.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body
        style={{ background: "#000000", padding: "0 20px", paddingTop: 20 }}
      >
        <Header />
        <Section style={{ marginTop: 16, marginBottom: 16 }}>
          <Img
            alt="Thumbnail Newsletter"
            height={445}
            width={731}
            src="https://cryptoiconsstorage.blob.core.windows.net/crypto-icons/oracleswap/og-image-mail.jpg"
            style={{
              marginLeft: "auto",
              marginRight: "auto",
              width: "100%",
              //  borderRadius: 12,
              height: "auto",
              maxWidth: 731,
              objectFit: "cover",
            }}
          />
          <Section style={{ marginTop: 32, textAlign: "center" }}>
            <Heading
              as="h1"
              style={{
                fontFamily: "'Funnel Display', Arial, sans-serif",
                fontSize: "36px",
                lineHeight: "40px",
                fontWeight: 700,
                color: "#D9F1E9",
                margin: 0,
              }}
            >
              Updates, insights, and releases
            </Heading>
            <Text
              style={{
                fontFamily: "'Funnel Sans', Arial, sans-serif",
                marginTop: "24px",
                fontSize: "16px",
                lineHeight: "24px",
                color: "#889697",
                maxWidth: "730px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Welcome to Oracles subscriber circle. Keep an eye on your inbox
              for new feature releases, Beta updates, and exclusive NFT
              opportunities.
            </Text>
          </Section>
        </Section>
        <Divider />
        <Footer />
      </Body>
    </Html>
  );
}

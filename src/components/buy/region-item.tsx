import {
  DocAdditionalProofOfIncome,
  DocAddress,
  DocDriversLicence,
  DocIncome,
  DocSelfie,
  DocResidence,
  DocPassport,
  CountryIsAllowed,
  CountryNotAllowed,
  DocNationalId,
} from "../icons";
import Image from "next/image";
import { flagCdnUri } from "@/types/flag-cdn-uri";
import { MoonpayCountry } from "@/types/moonpay-api";
import classNames from "classnames";
import DocumentItem from "./document-item";

type Props = {
  index: number;
  country: MoonpayCountry;
  isActive: boolean;
};

const docsProps = {
  additional_proof_of_income: {
    name: "Additional Proof Of Income",
    icon: <DocAdditionalProofOfIncome />,
    description:
      "Extra income evidence (tax return, contract, dividend statement).",
  },
  driving_licence: {
    name: "Drivers Licence",
    icon: <DocDriversLicence />,
    description:
      "Government driver's licence, front and back, valid and clear.",
  },
  national_identity_card: {
    name: "National Identity Card",
    icon: <DocNationalId />,
    description: "Official national ID, both sides, unexpired and readable.",
  },
  passport: {
    name: "Passport",
    icon: <DocPassport />,
    description: "Passport photo page with MRZ, unexpired, no glare or blur.",
  },
  proof_of_address: {
    name: "Proof Of Address",
    icon: <DocAddress />,
    description:
      "Recent bill/statement with your name and address (≤ 3 months).",
  },
  proof_of_income: {
    name: "Proof Of Income",
    icon: <DocIncome />,
    description:
      "Recent payslips or bank statements confirming source of funds.",
  },
  residence_permit: {
    name: "Residence Permit",
    icon: <DocResidence />,
    description: "Valid residence/visa permit showing right to stay.",
  },
  selfie: {
    name: "Selfie",
    icon: <DocSelfie />,
    description:
      "Live selfie matching your ID; follow in-app liveness prompts.",
  },
};

const RegionItem = ({ index, country, isActive }: Props) => {
  //   country.isBuyAllowed;
  //   country.isSellAllowed;
  //   country.supportedDocuments;

  //   export type MoonpaySupportedDocument =
  //     | "additional_proof_of_income"
  //     | "driving_licence"
  //     | "national_identity_card"
  //     | "passport"
  //     | "proof_of_address"
  //     | "proof_of_income"
  //     | "residence_permit"
  //     | "selfie";

  const imgSrc = flagCdnUri(country.alpha2);

  return (
    <tr
      className={classNames("trade-item pool-item region-item", {
        "region-item--active": isActive,
      })}
    >
      <td className="trade-item__index">
        <div>
          <span>{index}</span>
        </div>
      </td>
      <td>
        <div className="pool-item__pool">
          <div className="pool-item__pool__image">
            <Image
              width={32}
              height={32}
              alt={`${country.name} flag`}
              src={imgSrc}
            />
          </div>
          <div className="pool-item__pool__name">
            <div className="pool-item__pool__name__top">
              <span>{country.alpha2}</span>
              {/* <div>
                <span>{toTicker}</span>
              </div> */}
            </div>
            <div className="pool-item__pool__name__bottom">
              <span>{country.name}</span>
            </div>
          </div>
        </div>
      </td>
      <td className={"trade-item__kind"}>
        <div className="trade-item__kind__block">
          {country.isBuyAllowed ? <CountryIsAllowed /> : <CountryNotAllowed />}
        </div>
      </td>
      <td className={"trade-item__kind"}>
        <div className="trade-item__kind__block">
          {country.isBuyAllowed ? <CountryIsAllowed /> : <CountryNotAllowed />}
        </div>
      </td>

      <td className="region-item__doc">
        <div className="region-item__doc__icon">
          {country.supportedDocuments.length === 0 ? (
            docsProps[country.suggestedDocument] ? (
              <DocumentItem docSpec={docsProps[country.suggestedDocument]} />
            ) : null
          ) : (
            country.supportedDocuments.map((docKey, i) => {
              // return <div key={i}>{docsProps[docKey].icon}</div>;
              return <DocumentItem docSpec={docsProps[docKey]} key={i} />;
            })
          )}
        </div>
      </td>
      <td className="region-item__doc">
        <div className="region-item__doc__icon">
          {docsProps[country.suggestedDocument] && (
            <DocumentItem docSpec={docsProps[country.suggestedDocument]} />
          )}
        </div>
      </td>
    </tr>
  );
};

export default RegionItem;

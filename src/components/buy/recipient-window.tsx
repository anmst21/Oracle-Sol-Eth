import React from "react";
import { truncateAddress } from "@/helpers/truncate-address";
import { RecipientWallet, PaymentMethod, CoinFade, ArrowSmall } from "../icons";

type Props = {};

const address = "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce";

const RecipientWindow = (props: Props) => {
  return (
    <div className="recipient-window">
      <div className="recipient-window__recipient">
        <RecipientWallet />
        <span>Recipient</span>
      </div>
      <div className="recipient-window__address">
        <CoinFade address={address} />
        <span>{truncateAddress(address)}</span>
        <div className="recipient-window__address__arrow">
          <ArrowSmall />
        </div>
      </div>
      <div className="recipient-window__method">
        <PaymentMethod />
        <span>Payment Method</span>
      </div>
      <div className="recipient-window__card">
        <span>Card</span>
      </div>
    </div>
  );
};

export default RecipientWindow;

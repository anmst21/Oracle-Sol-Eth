import React, { useState } from "react";
import { HexChain, DiskMini, SwapCopy, Wallet, WalletStar } from "../icons";
import Image from "next/image";
import { truncateAddress } from "@/helpers/truncate-address";
import { getIconUri } from "@/helpers/get-icon-uri";
import classNames from "classnames";
import { handleCopy } from "@/helpers/handle-copy";

type Props = {
  chainId: string;
  address: string;
  name?: string;
  icon?: string | undefined;
  id: string;
  userWalletAdderess: string | undefined;
  isLinked: boolean;
  loginOrLink?: () => Promise<void>;
  unlink?: () => Promise<void>;
  logout?: () => Promise<void>;
  selectCallback: () => void;
  activeWalletAddress: string | undefined;
  isMini: boolean | undefined;
  isPasted?: boolean;
};

const WalletItem = ({
  chainId,
  address,
  name,
  icon,
  id,
  userWalletAdderess,
  isLinked,
  loginOrLink,
  unlink,
  logout,
  selectCallback,
  activeWalletAddress,
  isMini,
  isPasted,
}: Props) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={classNames("wallet-item", {
        "wallet-item--hover": isHovered,
        "wallet-item--active": address === activeWalletAddress,
      })}
    >
      <div className="wallet-item__top">
        <div className="wallet-item__icon">
          <Wallet />
        </div>
        <button
          disabled={address === activeWalletAddress}
          onClick={selectCallback}
          className="wallet-item__address"
          onMouseEnter={() => !isHovered && setIsHovered(true)}
          onMouseLeave={() => isHovered && setIsHovered(false)}
        >
          <HexChain
            uri={getIconUri(
              chainId === "792703809"
                ? Number(chainId)
                : Number(chainId.split(":")[1])
            )}
          />

          {truncateAddress(address as string)}
          {address === userWalletAdderess && (
            <div className="wallet-item__star">
              <WalletStar />
            </div>
          )}
          {isPasted && (
            <div className="wallet-item__star">
              <DiskMini />
            </div>
          )}
        </button>
        {!isMini && (
          <button
            onClick={() => handleCopy(address as string)}
            className="wallet-item__copy"
          >
            <SwapCopy />
          </button>
        )}
      </div>
      {!isMini && (
        <>
          <div className="wallet-item__center">
            <div className="wallet-item__client">
              {icon && (
                <Image
                  alt={id}
                  src={icon.replace(/^\n+/, "").trimEnd()}
                  width={24}
                  height={24}
                />
              )}
            </div>
            <div className="wallet-item__name">{name}</div>
          </div>
          <div className="wallet-item__bottom">
            {address === userWalletAdderess ? (
              <button
                className="wallet-item__disconnect wallet-item__logout"
                onClick={logout}
              >
                Log Out
              </button>
            ) : isLinked ? (
              <button
                className="wallet-item__disconnect wallet-item__logout"
                onClick={unlink}
              >
                {"Unlink"}
              </button>
            ) : (
              <button
                className="wallet-item__disconnect wallet-item__logout"
                onClick={loginOrLink}
              >
                Link
              </button>
            )}

            <button
              onMouseEnter={() => !isHovered && setIsHovered(true)}
              onMouseLeave={() => isHovered && setIsHovered(false)}
              disabled={address === activeWalletAddress}
              className="wallet-item__disconnect"
              onClick={selectCallback}
            >
              Select
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletItem;

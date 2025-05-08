"use client";
import { getTokenAccountsWithMetadata } from "@/actions/get-user-owned-ethereum-tokens";
import Connect from "@/components/connects";
export default function Home() {
  return (
    <div>
      <button
        onClick={async () => {
          const tokens = await getTokenAccountsWithMetadata({
            address: "0x1334429526Fa8B41BC2CfFF3a33C5762c5eD0Bce",
          });
          console.log("tokens", tokens);
        }}
        className="modal-chain"
      >
        {/* <Image
                    width={24}
                    height={24}
                    src={network.img}
                    alt={network.attributes.name}
                  /> */}

        <span>Get token accs</span>
      </button>
      {/* <Connect /> */}
    </div>
  );
}

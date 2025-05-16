import SwapContainer from "@/components/swap/swap-container";
import Connect from "@/components/connects";
import Wallets from "@/components/wallets";

export default function Page() {
  return (
    <div className="swap-page">
      <SwapContainer />
      {/* <Connect /> */}
      <Wallets />
    </div>
  );
}

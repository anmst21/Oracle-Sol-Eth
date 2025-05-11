import SwapHeader from "@/components/swap/swap-header";

export default function ExchangeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="exchange-layout">
      <SwapHeader />
      {children}
    </div>
  );
}

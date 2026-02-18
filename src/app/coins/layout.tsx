export const dynamic = "force-dynamic";

import CoinsHeader from "@/components/coins/coins-header";

export default async function CoinsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="coins-layout">
      <CoinsHeader />
      {children}
    </div>
  );
}

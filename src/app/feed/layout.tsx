import FeedHeader from "@/components/feed/feed-header";

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="feed-layout">
      <FeedHeader />
      {children}
    </div>
  );
}

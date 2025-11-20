import { HomeHeaderType } from "@/types/home-page";
import HomePageHeader from "@/components/home-section-header";

export default function Home() {
  return (
    <div className="coins-list">
      <HomePageHeader type={HomeHeaderType.About} />
      <HomePageHeader type={HomeHeaderType.Stats} />
      <HomePageHeader type={HomeHeaderType.Blog} />
      <HomePageHeader type={HomeHeaderType.Stakeholders} />
      <HomePageHeader type={HomeHeaderType.Chart} />
      <HomePageHeader type={HomeHeaderType.Feed} />
    </div>
  );
}

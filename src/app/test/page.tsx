import HomeBlog from "@/components/home-blog";
import HomeCta from "@/components/home-cta";
import HomeHero from "@/components/home-hero";
import HomeStakeholders from "@/components/home-stakeholders";
export default function Page() {
  return (
    <div className="landing-test">
      <HomeHero />
      <HomeBlog />
      <HomeStakeholders />
      <HomeCta />
    </div>
  );
}

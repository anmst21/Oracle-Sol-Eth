import HomeBlog from "@/components/home-blog";
import HeroCarousel from "@/components/home-hero/hero-carousel";
import HomeCta from "@/components/home-cta";
import HomeHero from "@/components/home-hero";
export default function Page() {
  return (
    <div className="landing-test">
      {/* <HeroCarousel /> */}
      <HomeHero />
      <HomeBlog />
      <HomeCta />
    </div>
  );
}

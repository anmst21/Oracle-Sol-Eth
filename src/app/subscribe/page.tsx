import BlogSubscribe from "@/components/blog/blog-subscribe";
import FooterForm from "@/components/footer/footer-form";

export default function Page() {
  return (
    <div className="subscribe-page">
      <BlogSubscribe isSubscribe />
      <FooterForm />
    </div>
  );
}

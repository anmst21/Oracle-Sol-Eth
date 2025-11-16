import ContactsForm from "@/components/contacts-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Oracle team. Whether you have questions, feedback, partnership ideas, or need product support — reach out and we'll get back to you. We're here to help you navigate the fastest multichain experience.",
};

export default function Page() {
  return (
    <div id="capcha-container" className="contacts-page">
      <div className="contacts-page__artwork"></div>
      <div className="contacts-page__form">
        <ContactsForm />
      </div>
    </div>
  );
}

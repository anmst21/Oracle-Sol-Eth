import ContactsForm from "@/components/contacts-form";

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

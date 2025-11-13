import ContactsForm from "@/components/contacts-form";

export default function Page() {
  return (
    <div className="contacts-page">
      <div className="contacts-page__artwork">
        <div className="contacts-page__inner">
          <ContactsForm />
        </div>
      </div>
    </div>
  );
}

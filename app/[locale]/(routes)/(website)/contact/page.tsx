/* eslint-disable @typescript-eslint/no-explicit-any */
import ContactPage from "@/app/components/website/contact/ContactPage";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/getTranslations";

export async function generateMetadata({ params }: any) {
  const { locale } = await params;
  const translations = getTranslations(locale ?? "en");

  const sharedMetadata = getSharedMetadata(locale ?? "en", translations);

  return {
    title: translations.contactMeta.title,
    description: translations.contactMeta.description,
    ...sharedMetadata,
  };
}

export default function Contact() {
  return <ContactPage />;
}

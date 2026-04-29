import AuthLayout from "@/app/components/auth/AuthLayout";
import CheckYourInbox from "@/app/components/auth/CheckYourInbox";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/getTranslations";
import { Locale } from "@/app/types/global";

interface PageParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const translations = getTranslations(locale ?? "en");
  const sharedMetadata = getSharedMetadata(locale ?? "en", translations);

  return {
    title: translations.checkYourInbox.meta.title,
    description: translations.checkYourInbox.meta.description,
    ...sharedMetadata,
  };
}

export default function CheckYourInboxPage() {
  return (
    <AuthLayout>
      <CheckYourInbox />
    </AuthLayout>
  );
}

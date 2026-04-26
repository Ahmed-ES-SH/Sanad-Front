import NotificationsClient from "@/app/components/website/notifications/NotificationsClient";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/getTranslations";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const translations = getTranslations(locale ?? "en");

  const sharedMetadata = getSharedMetadata(locale ?? "en", translations);

  return {
    title: translations.notificationsMeta.title,
    description: translations.notificationsMeta.description,
    ...sharedMetadata,
  };
}

export default function NotificationsPage() {
  return <NotificationsClient />;
}

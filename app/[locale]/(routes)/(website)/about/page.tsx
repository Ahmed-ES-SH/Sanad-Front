import AboutPage from "@/app/components/website/about/AboutPage";
import CompanyStats from "@/app/components/website/about/CompanyStats";
import TestimonialsSection from "@/app/components/website/about/TestimonialsSection";
import { directionMap } from "@/app/constants/global";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/getTranslations";
import { Locale } from "@/app/types/global";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const translations = getTranslations(locale ?? "en");

  const sharedMetadata = getSharedMetadata(locale ?? "en", translations);

  return {
    title: translations.aboutMeta.title,
    description: translations.aboutMeta.description,
    ...sharedMetadata,
  };
}

export default async function About({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return (
    <main dir={directionMap[locale]}>
      <AboutPage />
      <CompanyStats />
      <TestimonialsSection />
    </main>
  );
}

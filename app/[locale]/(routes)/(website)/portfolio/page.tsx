import { getPublishedProjects } from "@/app/actions/portfolioActions";
import ClientPortfolio from "@/app/components/website/portfolio/ClientPortfolio";
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
    title: translations.portfolioMeta?.title || "Our Portfolio — Sanad",
    description:
      translations.portfolioMeta?.description ||
      "Explore our delivered projects across web, mobile, branding, and more.",
    ...sharedMetadata,
  };
}

export default async function Portfolio() {
  const { data: projects, meta } = await getPublishedProjects();
  return <ClientPortfolio initialProjects={projects} meta={meta} />;
}

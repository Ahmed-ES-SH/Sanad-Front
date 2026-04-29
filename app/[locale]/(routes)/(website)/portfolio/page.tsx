import { Suspense } from "react";
import { getPublishedProjects } from "@/app/actions/portfolioActions";
import ClientPortfolio from "@/app/components/website/portfolio/ClientPortfolio";
import PortfolioSkeleton from "@/app/components/website/portfolio/PortfolioSkeleton";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/getTranslations";
import { Locale } from "@/app/types/global";
import { getCategories } from "@/app/actions/blogActions";

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

async function PortfolioContent() {
  const [projectsResponse, categoriesResponse] = await Promise.all([
    getPublishedProjects(),
    getCategories(),
  ]);

  const { data: projects, meta } = projectsResponse;
  const categories = categoriesResponse;
  return (
    <ClientPortfolio
      initialProjects={projects}
      meta={meta}
      categories={categories ?? []}
    />
  );
}

export default async function Portfolio() {
  return (
    <Suspense fallback={<PortfolioSkeleton />}>
      <PortfolioContent />
    </Suspense>
  );
}

import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getCategories } from "@/app/actions/blogActions";
import { getTranslations } from "@/app/helpers/getTranslations";
import { getPublishedServices } from "@/app/actions/servicesActions";

import ServicesComponent from "@/app/components/website/services/ServicesComponent";
import ServicesNotFound from "@/app/components/website/services/ServicesNotFound";
import HowWeWork from "@/app/components/website/services/HowWeWork";
import PricingPlans from "@/app/components/website/services/PricingPlans";
import { Locale } from "@/app/types/global";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const translations = getTranslations(locale ?? "en");

  const sharedMetadata = getSharedMetadata(locale ?? "en", translations);

  return {
    title: translations.servicesMeta.title,
    description: translations.servicesMeta.description,
    ...sharedMetadata,
  };
}

export default async function ServicesPage() {
  const categories = await getCategories();
  const response = await getPublishedServices();

  if (!response) return <ServicesNotFound />;

  const { data: services, meta } = response;

  return (
    <main id="main-content" className="relative mt-12">
      <ServicesComponent
        services={services}
        meta={meta}
        categories={categories ?? []}
      />
      <HowWeWork />
      <PricingPlans />
    </main>
  );
}

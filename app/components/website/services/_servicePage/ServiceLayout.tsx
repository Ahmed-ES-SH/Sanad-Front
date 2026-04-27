"use client";
import { directionMap } from "@/app/constants/global";
import { useLocale } from "@/app/hooks/useLocale";
import { useTranslation } from "@/app/hooks/useTranslation";
import { Service, StaticServiceData } from "@/app/types/service";
import { motion } from "framer-motion";
import { servicesData } from "@/app/constants/services";
import {
  ServiceHero,
  ServiceAbout,
  ServiceProcess,
  ServiceFAQ,
  ServiceOrderCTA,
  RelatedServices,
  ServiceHeader,
} from "./";

interface ServiceLayoutProps {
  service?: Service | null;
}

function mapBackendToStatic(backendService: Service): StaticServiceData {
  const staticService = servicesData[0];
  return {
    ...staticService,
    id: parseInt(backendService.id.replace(/-/g, "").slice(0, 8), 16) || 1,
    title: { en: backendService.title, ar: backendService.title },
    smallDesc: {
      en: backendService.shortDescription,
      ar: backendService.shortDescription,
    },
    description: {
      en: backendService.longDescription || "",
      ar: backendService.longDescription || "",
    },
    category:
      (backendService.category?.slug as StaticServiceData["category"]) ||
      "development",
  };
}

export default function ServiceLayout({
  service: backendService,
}: ServiceLayoutProps) {
  const locale = useLocale();
  const t_servicePage = useTranslation("servicePage");
  const t_ProjectPage = useTranslation("ProjectPage");
  const t_servicesComponents = useTranslation("servicesComponents");

  const staticService = servicesData[0];
  const service = backendService
    ? mapBackendToStatic(backendService)
    : staticService;

  return (
    <div dir={directionMap[locale]} className="min-h-screen mt-12 max-md:mt-20">
      <ServiceHero
        title={service.title}
        smallDesc={service.smallDesc}
        image={service.fullImage}
        category={service.category}
        stats={service.stats}
        locale={locale}
        translations={t_servicePage}
      />

      <ServiceHeader
        title={service.title}
        image={service.fullImage}
        local={locale}
        translations={t_servicesComponents}
      />

      <ServiceAbout
        description={service.description}
        benefits={service.benefits}
        targetAudience={service.targetAudience}
        locale={locale}
        translations={t_servicePage}
      />

      <ServiceProcess
        steps={service.processSteps}
        locale={locale}
        translations={t_servicePage}
      />

      <ServiceFAQ
        faq={service.faq}
        locale={locale}
        translations={t_servicePage}
      />

      <ServiceOrderCTA
        service={backendService}
        locale={locale}
        translations={t_servicePage}
      />

      <RelatedServices
        currentServiceId={service.id}
        currentCategory={service.category || "development"}
        translations={t_servicePage}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="c-container mx-auto px-4 py-16 md:py-24"
      >
        <div className="surface-card-elevated p-6 md:p-10">
          <div className="text-center mb-10">
            <h2 className="display-sm text-surface-900 font-display mb-3">
              {t_ProjectPage.allProjects}
            </h2>
            <p className="body-lg text-surface-500 max-w-2xl mx-auto">
              {t_ProjectPage.exploreProjects}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

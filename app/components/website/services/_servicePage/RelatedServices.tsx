"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Messages } from "@/app/hooks/useTranslation";
import LocaleLink from "@/app/components/global/LocaleLink";
import Img from "@/app/components/global/Img";
import { servicesData } from "@/app/constants/services";
import { useLocale } from "@/app/hooks/useLocale";
import { formatTitle } from "@/app/helpers/formatTitle";

type ServicePageMsgs = Messages["servicePage"];

interface RelatedServicesProps {
  currentServiceId: number;
  currentCategory?: string;
  translations: ServicePageMsgs;
}

export default function RelatedServices({
  currentServiceId,
  currentCategory,
  translations,
}: RelatedServicesProps) {
  const locale = useLocale();

  const relatedServices = servicesData
    .filter(
      (s) =>
        s.id !== currentServiceId &&
        (!currentCategory || s.category === currentCategory),
    )
    .slice(0, 4);

  const fallbackServices = servicesData
    .filter((s) => s.id !== currentServiceId)
    .slice(0, 4);
  const servicesToShow =
    relatedServices.length > 0 ? relatedServices : fallbackServices;

  if (servicesToShow.length === 0) return null;

  return (
    <section className="c-container mx-auto px-4 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-primary to-accent-amber" />
          <span className="caption-xs font-semibold text-primary uppercase tracking-wider">
            {translations.relatedServices}
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-primary to-accent-amber" />
        </div>
        <h2 className="display-sm md:display-md text-surface-900 font-display mb-4">
          {translations.exploreMore}
        </h2>
        <p className="body-lg text-surface-500 max-w-2xl mx-auto">
          {translations.relatedDescription}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {servicesToShow.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <LocaleLink
              href={`/services/${formatTitle(service.title[locale])}?serviceId=${service.id}`}
              className="surface-card group block h-full p-6 hover:shadow-surface-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative w-14 h-14 rounded-xl bg-surface-50 border border-surface-200 p-2.5 mb-5 group-hover:bg-primary/5 group-hover:border-primary/20 transition-all">
                <Img
                  src={service.imgsrc}
                  alt={service.title[locale]}
                  className="object-contain group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="heading-sm text-surface-900 font-display mb-2 group-hover:text-primary transition-colors">
                {service.title[locale]}
              </h3>
              <p className="body-sm text-surface-500 line-clamp-2">
                {service.smallDesc[locale]}
              </p>
            </LocaleLink>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

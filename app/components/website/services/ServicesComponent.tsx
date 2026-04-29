/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Service } from "@/app/types/service";
import { Category, PaginationMeta } from "@/app/types/global";
import { useLocale } from "@/app/hooks/useLocale";
import { useTranslation } from "@/app/hooks/useTranslation";
import { directionMap } from "@/app/constants/global";

import CategoriesFilter from "./CategoriesFilter";
import ServiceCard from "./ServiceCard";
import NoServicesFound from "./NoServicesFound";
import { useAppQuery } from "@/app/hooks/useAppQuery";
import { SERVICES_ENDPOINTS } from "@/app/constants/endpoints";
import { PublicServiceListResponse } from "@/app/types/service";
import Pagination from "@/app/components/global/Pagination";

interface ServicesComponentProps {
  services?: Service[];
  categories: Category[];
  meta?: PaginationMeta;
}

export default function ServicesComponent({
  services: initialServices,
  categories = [],
  meta,
}: ServicesComponentProps) {
  const locale = useLocale();
  const t = useTranslation("servicesPage");
  const t_services = useTranslation("services");
  const [activeFilter, setActiveFilter] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [services, setServices] = useState<Service[]>(initialServices ?? []);
  const [currentMeta, setCurrentMeta] = useState<PaginationMeta | undefined>(
    meta,
  );
  const itemsPerPage = 9;

  const handleFilterChange = (category: Category | null) => {
    setActiveFilter(category);
    setCurrentPage(1);
    setHasInteracted(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setHasInteracted(true);
  };

  // Dynamic Query Key and Endpoint
  const queryKey = [
    "published-services",
    activeFilter?.id || "all",
    currentPage,
  ];

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(currentPage));
  queryParams.set("limit", String(itemsPerPage));
  if (activeFilter) queryParams.set("categoryId", activeFilter.id);

  const endpoint = `${SERVICES_ENDPOINTS.LIST_PUBLISHED}?${queryParams.toString()}`;

  const { data: queryData, isFetching } =
    useAppQuery<PublicServiceListResponse>({
      queryKey,
      endpoint,
      enabled: hasInteracted,
    });

  useEffect(() => {
    if (queryData) {
      setServices(queryData.data);
      setCurrentMeta(queryData.meta);
    }
  }, [queryData]);

  return (
    <section
      dir={directionMap[locale]}
      className="py-24 bg-surface-50 "
      id="services"
    >
      <div className="c-container">
        {/* Refined Header: Left Aligned for Rhythm */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="surface-badge mb-4">{t.title1}</span>
            <h1 className="display-md font-display text-surface-900 mb-6 leading-tight">
              {t.title2}
            </h1>
            <p className="body-lg text-surface-500 leading-relaxed">
              {t.description}
            </p>
          </div>

          <CategoriesFilter
            activeFilter={activeFilter}
            onActiveFilterChange={handleFilterChange}
            categories={categories}
            locale={locale}
          />
        </div>

        {/* Services Grid - Removed layout animation for better INP */}
        <div className="relative min-h-[200px]">
          {isFetching && (
            <div className="absolute inset-0 flex justify-center items-start pt-20 z-10">
              <div className="w-12 h-12 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
          )}
          <motion.div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${
              isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {services && services?.length > 0 ? (
                services?.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    t={t_services}
                  />
                ))
              ) : (
                <NoServicesFound locale={locale} />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {currentMeta && currentMeta.lastPage > 1 && (
          <Pagination
            totalPages={currentMeta.lastPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </section>
  );
}

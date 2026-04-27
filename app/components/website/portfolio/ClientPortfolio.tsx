"use client";
import { useState, useMemo } from "react";
import type { Project } from "@/app/types/project";
import { directionMap } from "@/app/constants/global";
import { useLocale } from "@/app/hooks/useLocale";
import PortfolioHero from "./PortfolioHero";
import PortfolioGrid from "./PortfolioGrid";
import StatsBar from "./StatsBar";
import PortfolioCTA from "./PortfolioCTA";
import { useAppQuery } from "@/app/hooks/useAppQuery";
import { PORTFOLIO_ENDPOINTS } from "@/app/constants/endpoints";
import FilterBar from "./FilterBar";
import { useTranslation } from "@/app/hooks/useTranslation";
import { PaginationMeta } from "@/app/types/global";

interface ClientPortfolioProps {
  initialProjects: Project[];
  meta: PaginationMeta;
}

export default function ClientPortfolio({
  initialProjects,
  meta,
}: ClientPortfolioProps) {
  const locale = useLocale();
  const t = useTranslation("portfolioPage");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Dynamic Query Key and Endpoint
  const queryParams = new URLSearchParams();
  if (selectedCategory) queryParams.set("categoryId", selectedCategory);
  const queryString = queryParams.toString();
  const endpoint = `${PORTFOLIO_ENDPOINTS.LIST_PUBLISHED}${queryString ? `?${queryString}` : ""}`;

  // useAppQuery configured to use initialData if no category is selected
  const { data, isLoading, error } = useAppQuery<
    { data: Project[] },
    { message?: string }
  >({
    queryKey: ["portfolio-published", selectedCategory],
    endpoint,
    options: {
      initialData: selectedCategory ? undefined : { data: initialProjects },
    },
  });

  const projects = data?.data || [];

  // Extract unique categories from initial projects for the filter bar
  const categories = useMemo(() => {
    const cats = new Map<string, { en: string; ar: string }>();
    initialProjects.forEach((p) => {
      if (p.category) {
        cats.set(p.category.name, { en: p.category.name, ar: p.category.name });
      }
    });
    return Array.from(cats.values());
  }, [initialProjects]);

  if (isLoading && !projects.length) {
    return (
      <div
        dir={directionMap[locale]}
        className="min-h-dvh mt-6 flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-50)" }}
      >
        <div
          className="w-10 h-10 border-4 rounded-full animate-spin"
          style={{
            borderColor: "var(--surface-200)",
            borderTopColor: "var(--primary)",
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir={directionMap[locale]}
        className="min-h-dvh mt-6 flex items-center justify-center"
        style={{ backgroundColor: "var(--surface-50)" }}
      >
        <p className="text-lg" style={{ color: "var(--surface-500)" }}>
          {error?.message || t.failedToLoad}
        </p>
      </div>
    );
  }

  return (
    <div
      dir={directionMap[locale]}
      className="min-h-dvh mt-6"
      style={{ backgroundColor: "var(--surface-50)" }}
    >
      <PortfolioHero locale={locale} projectCount={projects.length} />

      {categories.length > 0 && (
        <FilterBar
          categories={categories}
          selected={selectedCategory || t.all}
          onSelect={(cat) =>
            setSelectedCategory(cat === "All" || cat === t.all ? null : cat)
          }
          locale={locale}
        />
      )}

      <PortfolioGrid projects={projects} local={locale} />
      <StatsBar locale={locale} />
      <PortfolioCTA locale={locale} />
    </div>
  );
}

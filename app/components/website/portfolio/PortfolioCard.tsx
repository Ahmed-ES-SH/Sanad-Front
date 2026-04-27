"use client";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { useTranslation } from "@/app/hooks/useTranslation";
import { formatTitle } from "@/app/helpers/formatTitle";

import type { Project } from "@/app/types/project";
import Img from "../../global/Img";
import LocaleLink from "../../global/LocaleLink";

interface Props {
  project: Project;
  index: number;
  isHero?: boolean;
}

export default function PortfolioCard({ project, index, isHero }: Props) {
  const t = useTranslation("portfolioPage");

  const projectHref = project.slug ? project.slug : formatTitle(project.title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isHero ? "md:row-span-2" : ""
      }`}
      style={{
        backgroundColor: "var(--surface-card-bg)",
        borderColor: "var(--surface-card-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--surface-card-border-hover)";
        e.currentTarget.style.boxShadow =
          "0 10px 15px rgba(15, 23, 42, 0.06), 0 4px 6px rgba(15, 23, 42, 0.04)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--surface-card-border)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <LocaleLink href={`/portfolio/${projectHref}`} className="block">
        <div
          className={`relative overflow-hidden ${isHero ? "aspect-4/3 md:aspect-4/5" : "aspect-16/10"}`}
        >
          <Img
            src={project.coverImageUrl || project.images?.[0] || ""}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading={index < 3 ? "eager" : "lazy"}
          />
          {/* Category tag */}
          <div
            className="absolute top-3 start-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "var(--surface-700)",
              backdropFilter: "none",
            }}
          >
            {project.category?.name || t.other}
          </div>
          {/* Arrow icon */}
          <div
            className="absolute top-3 end-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <FiArrowUpRight size={16} color="white" />
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          <h3
            className="heading-sm font-display mb-1.5 truncate"
            style={{ color: "var(--surface-900)" }}
          >
            {project.title}
          </h3>
          <p
            className="body-sm line-clamp-2 mb-3"
            style={{ color: "var(--surface-500)" }}
          >
            {project.shortDescription}
          </p>

          {/* Metrics - API might not have this natively, so we render techStack as an alternative if needed, or leave it empty */}
          <div className="flex items-center gap-4">
            {project.techStack?.slice(0, 2).map((tech, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span
                  className="text-xs font-medium px-2 py-1 rounded-md"
                  style={{
                    backgroundColor: "var(--surface-100)",
                    color: "var(--surface-600)",
                  }}
                >
                  {tech}
                </span>
              </div>
            ))}
          </div>
        </div>
      </LocaleLink>
    </motion.div>
  );
}

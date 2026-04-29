"use client";
import PortfolioCard from "./PortfolioCard";
import { useTranslation } from "@/app/hooks/useTranslation";
import type { Project } from "@/app/types/project";
import { motion } from "framer-motion";
import EmptyProjects from "./EmptyProjects";

interface Props {
  projects: Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function PortfolioGrid({ projects }: Props) {
  const t = useTranslation("portfolioPage");

  if (!projects || projects.length === 0) {
    return <EmptyProjects t={t} />;
  }

  return (
    <section className="c-container px-4 py-12 md:py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project, index) => (
          <PortfolioCard key={project.id} project={project} index={index} />
        ))}
      </motion.div>
    </section>
  );
}

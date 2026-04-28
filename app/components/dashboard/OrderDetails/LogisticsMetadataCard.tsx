// ============================================================================
// LOGISTICS METADATA CARD COMPONENT - Logistics-related metadata display
// ============================================================================

"use client";

import { motion } from "framer-motion";
import { FiTruck, FiClock, FiAlertCircle } from "react-icons/fi";

import { MetaItem } from "./MetaItem";
import { getTranslations } from "@/app/lib/i18n";

interface LogisticsMetadataCardProps {
  fulfilment?: string;
  slaDeadline?: string;
  priority?: string;
}

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const defaultValues = {
  fulfilment: "Not Applicable",
  slaDeadline: "Oct 30, 2023",
  priority: "High Response",
};

export function LogisticsMetadataCard({
  fulfilment = defaultValues.fulfilment,
  slaDeadline = defaultValues.slaDeadline,
  priority = defaultValues.priority,
}: LogisticsMetadataCardProps) {
  const t = getTranslations();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="surface-card p-6"
    >
      <motion.h3 variants={item} className="heading-sm text-surface-900 mb-4 border-b border-surface-100 pb-3">
        {t("orderDetails.logisticsContext")}
      </motion.h3>
      <motion.div variants={item} className="space-y-1">
        <MetaItem
          icon={<FiTruck />}
          label={t("orderDetails.fulfilment")}
          value={fulfilment}
        />
        <MetaItem
          icon={<FiClock />}
          label={t("orderDetails.slaDeadline")}
          value={slaDeadline}
        />
        <MetaItem
          icon={<FiAlertCircle />}
          label={t("orderDetails.priority")}
          value={priority}
        />
      </motion.div>
    </motion.div>
  );
}
// ============================================================================
// STATUS STEPPER COMPONENT - Order progress stepper visualization
// ============================================================================

"use client";

import { motion } from "framer-motion";
import {
  FiClock,
  FiTruck,
  FiCheckCircle,
} from "react-icons/fi";

import { getTranslations } from "@/app/lib/i18n";

interface StatusStepperProps {
  currentStatus: string;
}

// Icon mapping
const iconMap = {
  FiClock,
  FiTruck,
  FiCheckCircle,
};

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

export function StatusStepper({ currentStatus }: StatusStepperProps) {
  const t = getTranslations();
  
  const steps = [
    { id: "pending", label: t("orderDetails.orderProgress"), icon: FiClock },
    { id: "in_progress", label: t("orderDetails.orderProgress"), icon: FiTruck },
    { id: "completed", label: t("orderDetails.orderProgress"), icon: FiCheckCircle },
  ];

  const currentIndex = steps.findIndex((s) => s.id === currentStatus);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full py-8"
    >
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-200 -translate-y-1/2 z-0" />
        
        {/* Progress Line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0"
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <motion.div
              key={step.id}
              variants={item}
              className="relative z-10 flex flex-col items-center"
            >
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive
                    ? "var(--primary)"
                    : "var(--surface-card-bg)",
                  borderColor: isActive
                    ? "var(--primary)"
                    : "var(--surface-300)",
                  scale: isCurrent ? 1.1 : 1,
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-shadow ${
                  isCurrent ? "shadow-[0_0_0_4px_rgba(249,115,22,0.2)]" : ""
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-surface-400"
                  }`}
                />
              </motion.div>
              <span
                className={`absolute top-12 caption font-display whitespace-nowrap ${
                  isActive
                    ? "text-surface-900 font-semibold"
                    : "text-surface-400"
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
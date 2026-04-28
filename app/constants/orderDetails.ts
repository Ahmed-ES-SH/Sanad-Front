// ============================================================================
// ORDER DETAILS CONSTANTS - Status and stepper configurations
// ============================================================================

import type { StatusBadgeConfig } from "../types/order";

export const ORDER_STATUS_BADGE_CONFIG: Record<string, StatusBadgeConfig> = {
  pending: {
    label: "Pending",
    bgColor: "bg-accent-amber/15",
    textColor: "text-accent-amber",
    dotColor: "bg-accent-amber",
  },
  in_progress: {
    label: "Processing",
    bgColor: "bg-primary-100",
    textColor: "text-primary-dark",
    dotColor: "bg-primary",
  },
  completed: {
    label: "Completed",
    bgColor: "bg-accent-emerald/15",
    textColor: "text-accent-emerald",
    dotColor: "bg-accent-emerald",
  },
  cancelled: {
    label: "Cancelled",
    bgColor: "bg-surface-100",
    textColor: "text-surface-500",
    dotColor: "bg-surface-400",
  },
  paid: {
    label: "Paid",
    bgColor: "bg-accent-emerald/15",
    textColor: "text-accent-emerald",
    dotColor: "bg-accent-emerald",
  },
};

export const STATUS_STEPPER_STEPS = [
  { id: "pending", label: "Pending", icon: "FiClock" },
  { id: "in_progress", label: "Processing", icon: "FiTruck" },
  { id: "completed", label: "Completed", icon: "FiCheckCircle" },
] as const;

// Map current page status to API status
export const mapStatusToApi = (status: string): string => {
  const mapping: Record<string, string> = {
    processing: "in_progress",
  };
  return mapping[status] || status;
};

// Map API status to page status for display
export const mapApiStatusToDisplay = (status: string): string => {
  const mapping: Record<string, string> = {
    in_progress: "processing",
  };
  return mapping[status] || status;
};
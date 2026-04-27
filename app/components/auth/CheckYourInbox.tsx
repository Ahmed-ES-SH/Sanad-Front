"use client";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useLocale } from "@/app/hooks/useLocale";
import { directionMap } from "@/app/constants/global";
import { useTranslation } from "@/app/hooks/useTranslation";
import LocaleLink from "../global/LocaleLink";

export default function CheckYourInbox() {
  const locale = useLocale();
  const t = useTranslation("auth");
  const verifyT = useTranslation("verifyCode");
  const isRTL = locale === "ar";
  return (
    <motion.div
      dir={directionMap[locale]}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full flex flex-col items-center gap-8"
    >
      {/* Icon */}
      <div className="flex flex-col items-center gap-4">
        <FiCheckCircle
          size={64}
          className="text-accent-emerald"
          aria-hidden="true"
        />

        {/* Title */}
        <h1 className="font-display text-3xl font-extrabold text-surface-900 tracking-tight text-center">
          {t.checkYourInbox?.title || "Check your inbox for a verification email."}
        </h1>

        {/* Message */}
        <p className="text-surface-600 text-base leading-relaxed text-center px-2 max-w-md">
          {t.checkYourInbox?.description || "We have sent a verification email to your email address. Please check your inbox and click on the verification link to verify your email."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full flex flex-col items-center gap-4">
        <LocaleLink
          href="/signin"
          className="inline-flex items-center gap-2 surface-btn-primary px-6 py-3 rounded-xl font-semibold"
        >
          {isRTL ? <FiArrowRight size={18} /> : <FiArrowLeft size={18} />}
          {verifyT?.goToSignIn || "Go to Sign In"}
        </LocaleLink>
      </div>
    </motion.div>
  );
}

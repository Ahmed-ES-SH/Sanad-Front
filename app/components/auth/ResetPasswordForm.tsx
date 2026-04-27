"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "@/app/hooks/useLocale";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { verifyResetTokenAction } from "@/app/actions/authActions";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useTranslation } from "@/app/hooks/useTranslation";
import { directionMap } from "@/app/constants/global";

import Img from "../global/Img";
import LocaleLink from "../global/LocaleLink";
import RestForm from "./_resetPassword/RestForm";
import FormHeader from "./FormHeader";

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}

function ResetPasswordFormContent() {
  const locale = useLocale();
  const t = useTranslation("resetPassword");
  const isRTL = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("e");

  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    if (token && email) {
      verifyResetTokenAction(token, email).then((response) => {
        if (response.success) {
          setIsTokenValid(true);
        } else {
          toast.error(response.message);
          router.push(`/${locale}/forgot-password`);
        }
      });
    }
  }, [token, email, locale, router]);

  if (!isTokenValid) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      dir={directionMap[locale]}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-md:mt-12 space-y-6"
    >
      {/* Identity Branding */}
      <Img src="/sanad-logo.png" alt="Logo" className="w-16 mx-auto" />

      <FormHeader title={t.title} subtitle={t.subtitle} />

      <RestForm t={t} email={email} token={token} />

      <div className="pt-2 flex flex-col items-center">
        <LocaleLink
          href="/signin"
          className="text-sm text-primary font-medium transition-colors flex items-center gap-1 group"
        >
          {isRTL ? (
            <FiArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          ) : (
            <FiArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
          )}
          {t.backToLogin}
        </LocaleLink>
      </div>
    </motion.div>
  );
}

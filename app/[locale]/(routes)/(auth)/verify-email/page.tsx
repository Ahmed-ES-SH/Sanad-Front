import React from "react";
import AuthLayout from "@/app/components/auth/AuthLayout";
import VerifyEmailContent from "@/app/components/auth/VerifyEmailContent";
import { getTranslations } from "@/app/helpers/getTranslations";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { Locale } from "@/app/types/global";

interface PageParams {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: PageParams) {
  const { locale } = await params;
  const translations = getTranslations(locale ?? "en");

  const sharedMetadata = getSharedMetadata(locale ?? "en", translations);

  return {
    title: translations.verifyEmailMeta.title,
    description: translations.verifyEmailMeta.description,
    ...sharedMetadata,
  };
}

export default function VerifyEmailPage() {
  return (
    <AuthLayout>
      <VerifyEmailContent />
    </AuthLayout>
  );
}

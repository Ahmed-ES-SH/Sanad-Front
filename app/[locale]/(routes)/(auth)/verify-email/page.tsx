/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import AuthLayout from "@/app/components/auth/AuthLayout";
import VerifyEmailContent from "@/app/components/auth/VerifyEmailContent";
import { getTranslations } from "@/app/helpers/getTranslations";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

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

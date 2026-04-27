/* eslint-disable @typescript-eslint/no-explicit-any */
import AuthLayout from "@/app/components/auth/AuthLayout";
import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { getTranslations } from "@/app/helpers/getTranslations";

export async function generateMetadata({ params }: any) {
  const { local } = await params;
  const translations = getTranslations(local ?? "en");

  const sharedMetadata = getSharedMetadata(local ?? "en", translations);

  return {
    title: translations.resetPassword.meta.title,
    description: translations.resetPassword.meta.description,
    ...sharedMetadata,
  };
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}

import AuthLayout from "@/app/components/auth/AuthLayout";
import SignInForm from "@/app/components/auth/_signin/SignInForm";
import { getTranslations } from "@/app/helpers/getTranslations";
import { getSharedMetadata } from "@/app/helpers/getSharedMetadata";
import { Locale } from "@/app/types/global";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const translations = getTranslations(locale ?? "en");

  const sharedMetadata = getSharedMetadata(locale ?? "en", translations);

  return {
    title: translations.signInMeta.title,
    description: translations.signInMeta.description,
    ...sharedMetadata,
  };
}

export default function SigninPage() {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}

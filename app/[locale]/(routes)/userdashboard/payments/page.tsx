import { TransactionTable } from "@/app/components/userdashboard/_payments";
import BillingSettings from "@/app/components/userdashboard/_payments/BillingSettings";
import KPICards from "@/app/components/userdashboard/_payments/KPICards";
import PaymentMethods from "@/app/components/userdashboard/_payments/PaymentMethods";
import PaymentsHeader from "@/app/components/userdashboard/_payments/PaymentsHeader";
import { getTranslations } from "@/app/helpers/getTranslations";

interface UserPaymentsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function UserPaymentsPage({
  params,
}: UserPaymentsPageProps) {
  const { locale } = await params;
  const t = getTranslations(locale ?? "en", "payments");
  return (
    <main className="mt-24 mb-12 c-container px-6 md:px-8 min-h-screen">
      <PaymentsHeader t={t} />
      <KPICards t={t} />

      {/* Two Column Layout: Payment Methods & Billing Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Payment Methods Column */}
        <div className="xl:col-span-2">
          <PaymentMethods t={t} />
        </div>
        {/* Billing Settings Sidebar */}
        <div className="lg:col-span-1">
          <BillingSettings t={t} />
        </div>
      </div>

      {/* Transaction History Section */}
      <TransactionTable t={t} />
    </main>
  );
}

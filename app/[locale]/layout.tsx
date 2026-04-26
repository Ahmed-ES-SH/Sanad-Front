import Footer from "../components/global/_footer/Footer";
import Navbar from "../components/global/_navbar/Navbar";
import ClientLayout from "../components/global/ClientLayout";
import { directionMap } from "../constants/global";
import { Locale } from "../types/global";

export default async function layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      dir={directionMap[locale]}
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientLayout>
          <Navbar />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}

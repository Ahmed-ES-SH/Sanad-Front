/* eslint-disable @typescript-eslint/no-explicit-any */
import { Toaster } from "sonner";
import Footer from "../components/global/_footer/Footer";
import Navbar from "../components/global/_navbar/Navbar";
import ClientLayout from "../components/global/ClientLayout";
import { directionMap } from "../constants/global";
import { Locale } from "../types/global";

export default async function layout({ children, params }: any) {
  const { locale } = await params;
  return (
    <html
      lang={locale}
      dir={directionMap[locale as Locale]}
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClientLayout>
          <Navbar />
          <Toaster position="top-right" closeButton richColors />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}

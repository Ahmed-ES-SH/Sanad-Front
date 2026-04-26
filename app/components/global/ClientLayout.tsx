"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { queryClient } from "./QueryClient";
import useVariablesStore from "@/app/store/VariablesSlice";
import { useLocale } from "@/app/hooks/useLocale";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const locale = useLocale();
  const { setLocal, setWidth } = useVariablesStore();

  useEffect(() => {
    setLocal(locale);
  }, [locale, setLocal]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [setWidth]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

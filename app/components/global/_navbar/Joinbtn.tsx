"use client";

import LocaleLink from "../LocaleLink";
import { useTranslation } from "@/app/hooks/useTranslation";
import { useAuthStore } from "@/app/store/AuthSlice";
import UserButton from "./UserButton";

export default function Joinbtn() {
  const { isAuthenticated } = useAuthStore();
  const t = useTranslation("hero");

  return (
    <>
      {!isAuthenticated && (
        <div className="hidden sm:block">
          <LocaleLink
            href={"/signup"}
            className="surface-btn-primary min-h-[35px] px-2 text-xs"
          >
            {t.join}
          </LocaleLink>
        </div>
      )}

      {isAuthenticated && <UserButton />}
    </>
  );
}

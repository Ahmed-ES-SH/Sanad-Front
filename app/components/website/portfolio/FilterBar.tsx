"use client";
import { Category } from "@/app/types/global";

interface Props {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  locale: "en" | "ar";
}

export default function FilterBar({
  categories,
  selectedId,
  onSelect,
  locale,
}: Props) {
  const isRTL = locale === "ar";

  return (
    <div
      className="sticky z-30 border-b"
      style={{
        top: 0,
        backgroundColor: "rgba(250, 250, 249, 0.95)",
        borderColor: "var(--surface-200)",
        backdropFilter: "none",
      }}
    >
      <div className="c-container px-4">
        <div
          className="flex gap-2 py-3 overflow-x-auto scrollbar-hide"
          dir={isRTL ? "rtl" : "ltr"}
        >
          {categories.map((cat) => {
            const label = cat.name;
            const isActive = selectedId === cat.id;

            return (
              <button
                key={cat.id || "all"}
                onClick={() => onSelect(cat.id)}
                className="shrink-0 px-4 py-2 rounded-full text-sm font-medium"
                style={{
                  minHeight: "44px",
                  backgroundColor: isActive ? "var(--primary)" : "transparent",
                  color: isActive ? "white" : "var(--surface-600)",
                  border: `1px solid ${isActive ? "var(--primary)" : "var(--surface-200)"}`,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      "var(--surface-100)";
                    e.currentTarget.style.borderColor = "var(--surface-300)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "var(--surface-200)";
                  }
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

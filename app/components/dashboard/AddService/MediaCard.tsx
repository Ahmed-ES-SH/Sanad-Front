import { FiImage } from "react-icons/fi";
import Image from "next/image";

interface FormData {
  title: string;
  shortDescription: string;
  longDescription: string;
  iconUrl: string;
  coverImageUrl: string;
  categoryId: string;
}

interface MediaCardProps {
  formData: FormData;
  translations: {
    media: string;
    iconUrl: string;
    iconUrlPlaceholder: string;
    coverImageUrl: string;
    coverImageUrlPlaceholder: string;
    cover: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export default function MediaCard({
  formData,
  translations,
  onInputChange,
}: MediaCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-stone-100/40 border border-stone-200/60 shadow-sm backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiImage className="text-stone-500" size={18} />
          <h3 className="text-xs font-black text-stone-700 uppercase tracking-widest font-display">
            {translations.media}
          </h3>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
            {translations.iconUrl}
          </label>
          <input
            type="text"
            name="iconUrl"
            value={formData.iconUrl}
            onChange={onInputChange}
            className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none shadow-sm"
            placeholder={translations.iconUrlPlaceholder}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[0.65rem] font-black text-stone-500 uppercase tracking-[0.15em] ps-1 font-display">
            {translations.coverImageUrl}
          </label>
          <input
            type="text"
            name="coverImageUrl"
            value={formData.coverImageUrl}
            onChange={onInputChange}
            className="w-full bg-white border border-stone-200 rounded-xl p-3 text-sm text-stone-700 focus:ring-2 focus:ring-primary/10 focus:border-primary/30 transition-all outline-none shadow-sm"
            placeholder={translations.coverImageUrlPlaceholder}
          />
        </div>
        {formData.coverImageUrl && (
          <div className="relative group overflow-hidden rounded-xl bg-white border border-stone-200 flex items-center justify-center cursor-pointer min-h-[120px] shadow-inner">
            <Image
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000"
              src={formData.coverImageUrl}
              alt={translations.cover}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
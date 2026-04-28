interface FormData {
  title: string;
  shortDescription: string;
  longDescription: string;
  iconUrl: string;
  coverImageUrl: string;
  categoryId: string;
}

interface ServicePreviewCardProps {
  formData: FormData;
  translations: {
    servicePreview: string;
    title: string;
    description: string;
    hasCover: string;
    yes: string;
    no: string;
    untitled: string;
    set: string;
    empty: string;
  };
}

export default function ServicePreviewCard({
  formData,
  translations,
}: ServicePreviewCardProps) {
  return (
    <div className="surface-card p-6 bg-white border border-stone-200">
      <h3 className="text-[0.7rem] font-bold text-stone-500 uppercase tracking-widest mb-4">
        {translations.servicePreview}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-stone-500">{translations.title}</span>
          <span className="font-bold text-stone-900">
            {formData.title || translations.untitled}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-stone-500">{translations.description}</span>
          <span className="font-bold text-stone-900">
            {formData.shortDescription ? translations.set : translations.empty}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-stone-500">{translations.hasCover}</span>
          <span className="font-bold text-stone-900">
            {formData.coverImageUrl ? translations.yes : translations.no}
          </span>
        </div>
      </div>
    </div>
  );
}
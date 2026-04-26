import arTranslations from "../translations/ar.json";
import enTranslations from "../translations/en.json";

export const getTranslations = (locale: string) => {
  switch (locale) {
    case "ar":
      return arTranslations;
    case "en":
    default:
      return enTranslations;
  }
};

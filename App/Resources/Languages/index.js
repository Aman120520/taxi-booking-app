import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import English from "./English";
import French from "./French";

const resources = {
  English: {
    translation: English,
  },
  French: {
    translation: French,
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  fallbackLng: "English",
  resources,
  lng: "English",
  optioninterpolation: {
    escapeValue: false,
  },
});

export default i18n;

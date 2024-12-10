import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import enTranslation from "./locales/en/translation.json";
import heTranslation from "./locales/he/translation.json";

// Define the resources
const resources = {
  en: { translation: enTranslation },
  he: { translation: heTranslation },
};

// Detect the user's language
const userLanguage = navigator.language.split("-")[0]; // Get the language code (e.g., 'en', 'he')

// Initialize i18n
i18n
  .use(initReactI18next) // Bind React-i18next
  .init({
    resources, // Load translations from local files
    lng: userLanguage, // Set the detected language as the default language
    fallbackLng: "en", // Fallback language
    debug: false, // Enable debug mode for development
    interpolation: {
      escapeValue: false, // No need to escape in React
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import tr from './locales/tr.json';
import en from './locales/en.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? 'en';
const supportedLanguages = ['en', 'tr'];
const defaultLang = supportedLanguages.includes(deviceLanguage) ? deviceLanguage : 'en';

i18n.use(initReactI18next).init({
  resources: {
    tr: { translation: tr },
    en: { translation: en },
  },
  lng: defaultLang,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;

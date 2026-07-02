import { create } from 'zustand';
import { getLocales } from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

type Language = 'tr' | 'en';

interface LanguageState {
  language: Language;
  loadLanguage: () => Promise<void>;
  setLanguage: (lang: Language) => Promise<void>;
}

const LANG_KEY = '@bloom_language';

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'en',
  loadLanguage: async () => {
    const saved = await AsyncStorage.getItem(LANG_KEY);
    if (saved === 'tr' || saved === 'en') {
      await i18n.changeLanguage(saved);
      set({ language: saved });
    } else {
      const deviceLang = getLocales()[0]?.languageCode ?? 'en';
      const lang: Language = deviceLang === 'tr' ? 'tr' : 'en';
      await i18n.changeLanguage(lang);
      set({ language: lang });
    }
  },
  setLanguage: async (lang: Language) => {
    await AsyncStorage.setItem(LANG_KEY, lang);
    await i18n.changeLanguage(lang);
    set({ language: lang });
  },
}));

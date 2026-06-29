import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const LANG_KEY = '@bloom_language';

type Language = 'tr' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  loadLanguage: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: 'tr',
  setLanguage: async (lang) => {
    await AsyncStorage.setItem(LANG_KEY, lang);
    await i18n.changeLanguage(lang);
    set({ language: lang });
  },
  loadLanguage: async () => {
    const saved = await AsyncStorage.getItem(LANG_KEY);
    if (saved === 'tr' || saved === 'en') {
      await i18n.changeLanguage(saved);
      set({ language: saved });
    }
  },
}));

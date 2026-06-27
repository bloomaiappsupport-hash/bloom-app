import { create } from 'zustand';
import { darkColors, ColorSet } from '../theme/colors';

interface ThemeState {
  isDark: boolean;
  colors: ColorSet;
}

export const useThemeStore = create<ThemeState>(() => ({
  isDark: true,
  colors: darkColors,
}));

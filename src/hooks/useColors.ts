import { useThemeStore } from '../stores/themeStore';
import { ColorSet } from '../theme/colors';

export function useColors(): ColorSet {
  return useThemeStore((s) => s.colors);
}

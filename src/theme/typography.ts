import { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
} as const;

export const typography: Record<string, TextStyle> = {
  display: {
    fontFamily: fontFamily.extraBold,
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  h4: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    lineHeight: 24,
  },
  small: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  smallMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  captionBold: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  label: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
};

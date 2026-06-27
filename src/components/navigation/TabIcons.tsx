import React from 'react';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';

interface P { size?: number; color?: string }

export function TabHome({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M9 21V13h6v8" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

export function TabHabits({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="4" width="18" height="17" rx="3" stroke={color} strokeWidth="1.8" />
      <Path d="M8 2v4M16 2v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M8.5 13l2.5 2.5 5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function TabCoach({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M12 8v4M10 10h4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function TabInsights({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="20" x2="12" y2="10" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Line x1="18" y1="20" x2="18" y2="5" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
      <Line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function TabProfile({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.8" />
      <Path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

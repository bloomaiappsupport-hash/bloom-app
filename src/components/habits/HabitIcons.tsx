import React from 'react';
import Svg, { Path, Circle, Line, Rect, Polyline, G } from 'react-native-svg';

interface P { size?: number; color?: string }

function IcDumbbell({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 4v16M18 4v16" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Rect x="3" y="8" width="6" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Rect x="15" y="8" width="6" height="8" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function IcBrain({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5a5 5 0 0 0-5 5c0 1.6.75 3 1.9 3.9A3.5 3.5 0 0 0 12 19a3.5 3.5 0 0 0 3.1-5.1A5 5 0 0 0 12 5z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M7 10H5a2 2 0 0 0 0 4h2M17 10h2a2 2 0 0 1 0 4h-2" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcMoon({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function IcLeaf({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22c4.97 0 9-4.03 9-9C21 7.07 12 2 12 2S3 7.07 3 13c0 4.97 4.03 9 9 9z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Line x1="12" y1="22" x2="12" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcPeople({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.8" />
      <Path d="M3 20c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M16 3.13a4 4 0 0 1 0 7.75M21 20c0-2.76-2.24-5-5-5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcRocket({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2C12 2 6 6 6 13l3 3 3-1 3 1 3-3c0-7-6-11-6-11z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M9 16c0 2 .5 4 3 6 2.5-2 3-4 3-6" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Circle cx="12" cy="11" r="2" stroke={color} strokeWidth="1.6" />
    </Svg>
  );
}

function IcBook({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function IcRun({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="13" cy="4" r="2" stroke={color} strokeWidth="1.8" />
      <Path d="M7 22l3-6 4 2 2-5 3 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.5 8.5L13 10l2.5-3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IcLotus({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22c3-3 5-6 5-10a5 5 0 0 0-5-5 5 5 0 0 0-5 5c0 4 2 7 5 10z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M7 12c-2-1-4-1-5 1 1 3 3 5 5 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M17 12c2-1 4-1 5 1-1 3-3 5-5 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcDrop({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function IcPen({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 20h9" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
    </Svg>
  );
}

function IcTarget({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.8" />
      <Circle cx="12" cy="12" r="1.5" fill={color} />
    </Svg>
  );
}

function IcPlant({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22v-8M12 14C12 9 9 5 4 4c0 5 3 9 8 10z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M12 14c0-5 3-9 8-10 0 5-3 9-8 10z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function IcMusic({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 18V5l12-2v13" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="6" cy="18" r="3" stroke={color} strokeWidth="1.8" />
      <Circle cx="18" cy="16" r="3" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

function IcPill({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.5 20.5L3.5 13.5a5 5 0 0 1 7.07-7.07l7 7a5 5 0 0 1-7.07 7.07z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Line x1="8.5" y1="8.5" x2="15.5" y2="15.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

function IcSun({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.8" />
      <Line x1="12" y1="1" x2="12" y2="3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="12" y1="21" x2="12" y2="23" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="1" y1="12" x2="3" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="21" y1="12" x2="23" y2="12" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function IcFlame({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"
        stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <Path d="M12 12c0 2-1 3.5-1 5a1 1 0 0 0 2 0c0-1.5-1-3-1-5z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
    </Svg>
  );
}

export function IcSparkle({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M5.64 18.36l2.12-2.12M16.24 7.76l2.12-2.12"
        stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}

export const HABIT_ICON_KEYS = [
  'dumbbell', 'brain', 'moon', 'leaf', 'people', 'rocket',
  'book', 'run', 'lotus', 'drop', 'pen', 'target',
  'plant', 'music', 'pill', 'sun',
] as const;

export type HabitIconKey = typeof HABIT_ICON_KEYS[number];

export const HABIT_ICON_MAP: Record<HabitIconKey, React.FC<P>> = {
  dumbbell: IcDumbbell,
  brain: IcBrain,
  moon: IcMoon,
  leaf: IcLeaf,
  people: IcPeople,
  rocket: IcRocket,
  book: IcBook,
  run: IcRun,
  lotus: IcLotus,
  drop: IcDrop,
  pen: IcPen,
  target: IcTarget,
  plant: IcPlant,
  music: IcMusic,
  pill: IcPill,
  sun: IcSun,
};

export function HabitIcon({ iconKey, size = 24, color = '#fff' }: { iconKey: string; size?: number; color?: string }) {
  const Icon = HABIT_ICON_MAP[iconKey as HabitIconKey] ?? IcSparkle;
  return <Icon size={size} color={color} />;
}

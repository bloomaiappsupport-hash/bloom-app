import React from 'react';
import Svg, { Path, Circle, Line, Rect, Polyline, Polygon, G } from 'react-native-svg';

interface IconProps { size?: number; color?: string }

const S = 2;   // default strokeWidth
const C = 'round'; // strokeLinecap
const J = 'round'; // strokeLinejoin

// ── Time of day ──────────────────────────────────────────────────────────────

export function IconSunrise({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 4v2M4.93 7.93l1.41 1.41M3 14h2M19 14h2M17.66 9.34l1.41-1.41" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M5 14a7 7 0 0 1 14 0" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Line x1="2" y1="18" x2="22" y2="18" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Line x1="5" y1="21" x2="19" y2="21" stroke={color} strokeWidth={1.2} strokeLinecap={C} opacity="0.5" />
    </Svg>
  );
}

export function IconSun({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth={S} />
      <Path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={color} strokeWidth={S} strokeLinecap={C} />
    </Svg>
  );
}

export function IconCloudSun({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 18a5 5 0 0 0-10 0" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M12 9v2M4.22 10.22l1.42 1.42M20 12h-2M18.36 7.64l-1.42 1.42M16 13a4 4 0 1 0-8 0" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M6 18a5 5 0 0 1 0-5h1.5a3.5 3.5 0 1 1 7 0H17a3 3 0 0 1 0 5H6z" stroke={color} strokeWidth={S} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconMoon({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Circle cx="18" cy="5" r="1" fill={color} opacity="0.7" />
      <Circle cx="20" cy="9" r="0.7" fill={color} opacity="0.5" />
    </Svg>
  );
}

// ── Goal ─────────────────────────────────────────────────────────────────────

export function IconDumbbell({ size = 36, color = '#06D6A0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="10" width="3" height="4" rx="1" stroke={color} strokeWidth={S} strokeLinejoin={J} />
      <Rect x="5" y="8" width="3" height="8" rx="1.5" stroke={color} strokeWidth={S} strokeLinejoin={J} />
      <Rect x="16" y="8" width="3" height="8" rx="1.5" stroke={color} strokeWidth={S} strokeLinejoin={J} />
      <Rect x="19" y="10" width="3" height="4" rx="1" stroke={color} strokeWidth={S} strokeLinejoin={J} />
      <Line x1="8" y1="12" x2="16" y2="12" stroke={color} strokeWidth={S} strokeLinecap={C} />
    </Svg>
  );
}

export function IconBrain({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5C10.07 5 8.5 6.57 8.5 8.5c0 .26.03.52.08.77A3.5 3.5 0 0 0 5 12.5C5 14.43 6.57 16 8.5 16H12" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M12 5c1.93 0 3.5 1.57 3.5 3.5 0 .26-.03.52-.08.77A3.5 3.5 0 0 1 19 12.5c0 1.93-1.57 3.5-3.5 3.5H12" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Line x1="12" y1="5" x2="12" y2="19" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M8.5 10h1M14 10h1.5M9 14h1.5M14 14h1" stroke={color} strokeWidth={1.5} strokeLinecap={C} opacity="0.6" />
    </Svg>
  );
}

export function IconRocket({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconSprout({ size = 36, color = '#06D6A0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M7 20h10" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M12 20V9" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M12 9C12 9 8 8 7 4c3 0 5 2 5 5z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M12 11c0 0 4-1 5-5-3 0-5 2-5 5z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
    </Svg>
  );
}

// ── Barrier ───────────────────────────────────────────────────────────────────

export function IconDropHeart({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Line x1="12" y1="8" x2="12" y2="14" stroke={color} strokeWidth={S} strokeLinecap={C} opacity="0.7" />
      <Circle cx="12" cy="16.5" r="0.8" fill={color} opacity="0.7" />
    </Svg>
  );
}

export function IconClock({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={S} />
      <Path d="M12 7v5l3 3" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconThinkHead({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="10" r="7" stroke={color} strokeWidth={S} />
      <Path d="M12 20v-3" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Line x1="9" y1="20" x2="15" y2="20" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M12 8v2" stroke={color} strokeWidth={S + 0.5} strokeLinecap={C} />
      <Circle cx="12" cy="12" r="0.8" fill={color} />
    </Svg>
  );
}

export function IconMountain({ size = 36, color = '#06D6A0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M3 20l7-12 3 5 2-3 6 10H3z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
    </Svg>
  );
}

// ── Habit count ───────────────────────────────────────────────────────────────

export function IconTarget({ size = 36, color = '#06D6A0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={S} />
      <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth={S} opacity="0.6" />
      <Circle cx="12" cy="12" r="2" stroke={color} strokeWidth={S} />
    </Svg>
  );
}

export function IconLightning({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconFlame({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8.5 14.5A6.5 6.5 0 0 1 15 8c0 2-1 3.5-2 4.5 1-3-1-5.5-1-5.5s0 4-3.5 7.5A6.5 6.5 0 0 1 8.5 14.5z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M8.5 14.5A6.5 6.5 0 0 0 12 21a6.5 6.5 0 0 0 6.5-6.5A6.5 6.5 0 0 0 15 8" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Circle cx="12" cy="17" r="1.5" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

export function IconInfinity({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 12c-2-2.5-4-4-6-4a4 4 0 0 0 0 8c2 0 4-1.5 6-4z" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M12 12c2 2.5 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.5-6 4z" stroke={color} strokeWidth={S} strokeLinecap={C} />
    </Svg>
  );
}

// ── Motivation type ───────────────────────────────────────────────────────────

export function IconTrophy({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M8 21h8M12 17v4" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M7 4H4v3a4 4 0 0 0 4 4h0M17 4h3v3a4 4 0 0 1-4 4h0" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M7 4h10v5a5 5 0 0 1-10 0V4z" stroke={color} strokeWidth={S} strokeLinejoin={J} />
      <Path d="M11 8.5l.9 1.8 2 .3-1.45 1.41.34 2-1.79-.94-1.79.94.34-2L8.1 10.6l2-.3L11 8.5z" stroke={color} strokeWidth={1.2} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconBarChart({ size = 36, color = '#06D6A0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1="12" y1="20" x2="12" y2="10" stroke={color} strokeWidth={S + 1} strokeLinecap={C} />
      <Line x1="6" y1="20" x2="6" y2="14" stroke={color} strokeWidth={S + 1} strokeLinecap={C} />
      <Line x1="18" y1="20" x2="18" y2="4" stroke={color} strokeWidth={S + 1} strokeLinecap={C} />
      <Line x1="3" y1="20" x2="21" y2="20" stroke={color} strokeWidth={S} strokeLinecap={C} />
    </Svg>
  );
}

export function IconPeople({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="7" r="3" stroke={color} strokeWidth={S} />
      <Path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Circle cx="17" cy="7" r="2.5" stroke={color} strokeWidth={1.5} opacity="0.6" />
      <Path d="M21 21v-2a3.5 3.5 0 0 0-2.5-3.35" stroke={color} strokeWidth={1.5} strokeLinecap={C} opacity="0.6" />
    </Svg>
  );
}

export function IconSparkle({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" stroke={color} strokeWidth={1.5} strokeLinecap={C} strokeLinejoin={J} opacity="0.7" />
      <Path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" stroke={color} strokeWidth={1.5} strokeLinecap={C} strokeLinejoin={J} opacity="0.5" />
    </Svg>
  );
}

// ── Focus area ────────────────────────────────────────────────────────────────

export function IconRunning({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="14" cy="4.5" r="1.5" stroke={color} strokeWidth={S} />
      <Path d="M10 10.5l2-3 3 2.5" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M7 20l3-5 2 2 2-4 3 3" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M14.5 9.5l1.5 2-3 1" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconLotus({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22c0 0-8-4-8-10a8 8 0 0 1 8-8 8 8 0 0 1 8 8c0 6-8 10-8 10z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M12 6c0 0-4 2-4 6s4 7 4 7" stroke={color} strokeWidth={1.5} strokeLinecap={C} opacity="0.6" />
      <Path d="M12 6c0 0 4 2 4 6s-4 7-4 7" stroke={color} strokeWidth={1.5} strokeLinecap={C} opacity="0.6" />
      <Line x1="12" y1="6" x2="12" y2="19" stroke={color} strokeWidth={1.5} strokeLinecap={C} opacity="0.4" />
    </Svg>
  );
}

export function IconBook({ size = 36, color = '#06D6A0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke={color} strokeWidth={S} strokeLinejoin={J} />
      <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke={color} strokeWidth={S} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconSleep({ size = 36, color = '#38BDF8' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M17 18a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 0-5 10z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M14 6l2 0-2 2.5h2" stroke={color} strokeWidth={1.5} strokeLinecap={C} strokeLinejoin={J} opacity="0.8" />
      <Path d="M10 3l1.5 0-1.5 2h1.5" stroke={color} strokeWidth={1.5} strokeLinecap={C} strokeLinejoin={J} opacity="0.5" />
    </Svg>
  );
}

// ── Reminder ──────────────────────────────────────────────────────────────────

export function IconBell({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
    </Svg>
  );
}

export function IconBellSlash({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Path d="M18 8a6 6 0 0 0-9.33-5M10.7 4.7A6.003 6.003 0 0 0 6 8c0 7-3 9-3 9h14" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Line x1="3" y1="3" x2="21" y2="21" stroke={color} strokeWidth={S} strokeLinecap={C} />
    </Svg>
  );
}

export function IconWarning({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Circle cx="12" cy="16.5" r="0.8" fill={color} />
    </Svg>
  );
}

export function IconCircleX({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth={S} />
      <Line x1="15" y1="9" x2="9" y2="15" stroke={color} strokeWidth={S} strokeLinecap={C} />
      <Line x1="9" y1="9" x2="15" y2="15" stroke={color} strokeWidth={S} strokeLinecap={C} />
    </Svg>
  );
}

// ── Personality ───────────────────────────────────────────────────────────────

export function IconClipboard({ size = 36, color = '#06D6A0' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke={color} strokeWidth={S} strokeLinejoin={J} />
      <Rect x="9" y="3" width="6" height="4" rx="1" stroke={color} strokeWidth={S} />
      <Line x1="9" y1="12" x2="15" y2="12" stroke={color} strokeWidth={S} strokeLinecap={C} opacity="0.7" />
      <Line x1="9" y1="16" x2="13" y2="16" stroke={color} strokeWidth={S} strokeLinecap={C} opacity="0.5" />
    </Svg>
  );
}

export function IconDice({ size = 36, color = '#F72585' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth={S} />
      <Circle cx="8.5" cy="8.5" r="1" fill={color} />
      <Circle cx="15.5" cy="8.5" r="1" fill={color} />
      <Circle cx="12" cy="12" r="1" fill={color} />
      <Circle cx="8.5" cy="15.5" r="1" fill={color} />
      <Circle cx="15.5" cy="15.5" r="1" fill={color} />
    </Svg>
  );
}

export function IconDiamond({ size = 36, color = '#9D5CF5' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 3h12l4 6-10 13L2 9l4-6z" stroke={color} strokeWidth={S} strokeLinecap={C} strokeLinejoin={J} />
      <Path d="M2 9h20M6 3l3 6h6l3-6" stroke={color} strokeWidth={1.5} strokeLinecap={C} strokeLinejoin={J} opacity="0.5" />
    </Svg>
  );
}

export function IconGear({ size = 36, color = '#FFB703' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={S} />
      <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke={color} strokeWidth={S} />
    </Svg>
  );
}

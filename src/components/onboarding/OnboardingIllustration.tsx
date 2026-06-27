import React from 'react';
import { View } from 'react-native';
import Svg, {
  Circle, Rect, Line, Path, G, Defs,
  LinearGradient, Stop, Polygon, Ellipse,
} from 'react-native-svg';
import { colors } from '../../theme';

interface Props { size?: number }

// Slide 1 — Büyüyen bitki / growth
export function IllustrationGrowth({ size = 220 }: Props) {
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Defs>
          <LinearGradient id="g1stem" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#06D6A0" />
            <Stop offset="1" stopColor="#047857" />
          </LinearGradient>
          <LinearGradient id="g1leaf" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9D5CF5" />
            <Stop offset="1" stopColor="#06D6A0" />
          </LinearGradient>
          <LinearGradient id="g1flower" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFB703" />
            <Stop offset="1" stopColor="#F72585" />
          </LinearGradient>
        </Defs>

        {/* Ground circle */}
        <Ellipse cx="110" cy="190" rx="55" ry="10" fill="#1E1E3A" />

        {/* Stem */}
        <Rect x="107" y="100" width="6" height="90" rx="3" fill="url(#g1stem)" />

        {/* Left leaf */}
        <Path d="M113 150 Q80 120 90 90 Q120 115 113 150Z" fill="url(#g1leaf)" opacity="0.9" />

        {/* Right leaf */}
        <Path d="M107 130 Q140 105 145 75 Q115 95 107 130Z" fill="url(#g1leaf)" opacity="0.75" />

        {/* Flower petals */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const px = 110 + 22 * Math.cos(rad);
          const py = 88 + 22 * Math.sin(rad);
          return <Circle key={i} cx={px} cy={py} r="14" fill="url(#g1flower)" opacity="0.85" />;
        })}

        {/* Flower center */}
        <Circle cx="110" cy="88" r="12" fill="#FFB703" />
        <Circle cx="110" cy="88" r="6" fill="#FFFFFF" opacity="0.7" />

        {/* Floating dots */}
        <Circle cx="60" cy="80" r="4" fill={colors.secondary} opacity="0.5" />
        <Circle cx="165" cy="100" r="3" fill={colors.primary} opacity="0.5" />
        <Circle cx="75" cy="130" r="2.5" fill={colors.gold} opacity="0.4" />
        <Circle cx="155" cy="145" r="3.5" fill={colors.accent} opacity="0.4" />
      </Svg>
    </View>
  );
}

// Slide 2 — AI neural network
export function IllustrationAI({ size = 220 }: Props) {
  const nodes = [
    { x: 110, y: 60 },
    { x: 60, y: 110 }, { x: 110, y: 110 }, { x: 160, y: 110 },
    { x: 40, y: 165 }, { x: 85, y: 165 }, { x: 135, y: 165 }, { x: 180, y: 165 },
  ];
  const edges = [
    [0, 1], [0, 2], [0, 3],
    [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7],
  ];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Defs>
          <LinearGradient id="g2node" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9D5CF5" />
            <Stop offset="1" stopColor="#4C1D95" />
          </LinearGradient>
          <LinearGradient id="g2nodeG" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#06D6A0" />
            <Stop offset="1" stopColor="#0891B2" />
          </LinearGradient>
        </Defs>

        {/* Edges */}
        {edges.map(([a, b], i) => (
          <Line
            key={i}
            x1={nodes[a].x} y1={nodes[a].y}
            x2={nodes[b].x} y2={nodes[b].y}
            stroke={colors.primary} strokeWidth="1.5" opacity="0.35"
            strokeDasharray="4,4"
          />
        ))}

        {/* Nodes */}
        {nodes.map((n, i) => (
          <G key={i}>
            <Circle cx={n.x} cy={n.y} r={i === 0 ? 22 : i < 4 ? 14 : 11}
              fill={i === 0 ? 'url(#g2node)' : i < 4 ? 'url(#g2nodeG)' : 'url(#g2node)'}
              opacity={i === 0 ? 1 : 0.8}
            />
            <Circle cx={n.x} cy={n.y} r={i === 0 ? 10 : i < 4 ? 6 : 4}
              fill="#fff" opacity={0.2}
            />
          </G>
        ))}

        {/* Pulse rings on top node */}
        <Circle cx="110" cy="60" r="32" fill="none" stroke="#9D5CF5" strokeWidth="1" opacity="0.3" />
        <Circle cx="110" cy="60" r="44" fill="none" stroke="#7C3AED" strokeWidth="0.8" opacity="0.2" />
      </Svg>
    </View>
  );
}

// Slide 3 — Ritual stack (chained circles)
export function IllustrationStack({ size = 220 }: Props) {
  const layers = [
    { y: 60, r: 36, color1: '#F72585', color2: '#B91C6C', label: '☀️' },
    { y: 110, r: 40, color1: '#7C3AED', color2: '#4C1D95', label: '🧠' },
    { y: 163, r: 44, color1: '#06D6A0', color2: '#047857', label: '💪' },
  ];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Defs>
          {layers.map((l, i) => (
            <LinearGradient key={i} id={`g3l${i}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={l.color1} />
              <Stop offset="1" stopColor={l.color2} />
            </LinearGradient>
          ))}
        </Defs>

        {/* Connector lines */}
        <Line x1="110" y1="96" x2="110" y2="70" stroke="#ffffff" strokeWidth="2" opacity="0.15" />
        <Line x1="110" y1="150" x2="110" y2="119" stroke="#ffffff" strokeWidth="2" opacity="0.15" />

        {layers.map((l, i) => (
          <G key={i}>
            {/* Shadow */}
            <Ellipse cx="113" cy={l.y + 4} rx={l.r} ry={l.r * 0.35} fill="#000" opacity="0.2" />
            {/* Disk */}
            <Ellipse cx="110" cy={l.y} rx={l.r} ry={l.r * 0.32} fill={`url(#g3l${i})`} />
            {/* Highlight */}
            <Ellipse cx="105" cy={l.y - 4} rx={l.r * 0.5} ry={l.r * 0.12} fill="#fff" opacity="0.25" />
          </G>
        ))}
      </Svg>
    </View>
  );
}

// Slide 4 — Habit DNA hexagonal grid
export function IllustrationDNA({ size = 220 }: Props) {
  const hexR = 22;
  const hx = hexR * Math.sqrt(3);
  const hy = hexR * 1.5;

  const hexPath = (cx: number, cy: number) => {
    const pts = Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + hexR * 0.85 * Math.cos(a)},${cy + hexR * 0.85 * Math.sin(a)}`;
    }).join(' ');
    return pts;
  };

  const grid = [
    { col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 },
    { col: -0.5, row: 1 }, { col: 0.5, row: 1 }, { col: 1.5, row: 1 }, { col: 2.5, row: 1 },
    { col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 },
  ];

  const hexColors = ['#7C3AED', '#06D6A0', '#F72585', '#FFB703', '#38BDF8', '#9D5CF5', '#06D6A0', '#7C3AED', '#F72585', '#FFB703'];

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        {grid.map((cell, i) => {
          // Center grid in 220×220 viewBox: x-center = 110, y-center = 110
          // Grid x-span (col -0.5..2.5): center at col=1, offset = 1*hx from base
          // base_x = 110 - 1*hx = 110 - 38.1 ≈ 72; base_y = 110 - 1*hy = 110 - 33 = 77
          const cx = 72 + cell.col * hx;
          const cy = 77 + cell.row * hy;
          return (
            <G key={i}>
              <Polygon
                points={hexPath(cx, cy)}
                fill={hexColors[i % hexColors.length]}
                opacity={0.6 + (i % 3) * 0.13}
                stroke="#080812"
                strokeWidth="2"
              />
              <Circle cx={cx} cy={cy} r={hexR * 0.25} fill="#fff" opacity="0.2" />
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

// Slide 5 — Ready / radial burst
export function IllustrationReady({ size = 220 }: Props) {
  const rays = 12;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 220 220">
        <Defs>
          <LinearGradient id="g5center" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9D5CF5" />
            <Stop offset="1" stopColor="#06D6A0" />
          </LinearGradient>
        </Defs>

        {/* Rays */}
        {Array.from({ length: rays }, (_, i) => {
          const angle = (2 * Math.PI * i) / rays;
          const x1 = 110 + 38 * Math.cos(angle);
          const y1 = 110 + 38 * Math.sin(angle);
          const x2 = 110 + 80 * Math.cos(angle);
          const y2 = 110 + 80 * Math.sin(angle);
          return (
            <Line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i % 2 === 0 ? colors.primary : colors.secondary}
              strokeWidth={i % 3 === 0 ? 3 : 1.5}
              opacity={0.5 + (i % 2) * 0.25}
              strokeLinecap="round"
            />
          );
        })}

        {/* Outer ring */}
        <Circle cx="110" cy="110" r="86" fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.2" />
        <Circle cx="110" cy="110" r="76" fill="none" stroke={colors.secondary} strokeWidth="0.8" opacity="0.15" />

        {/* Center bloom */}
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <Circle
              key={i}
              cx={110 + 16 * Math.cos(rad)}
              cy={110 + 16 * Math.sin(rad)}
              r="14"
              fill={i % 2 === 0 ? colors.primary : colors.secondary}
              opacity="0.85"
            />
          );
        })}
        <Circle cx="110" cy="110" r="18" fill="url(#g5center)" />
        <Circle cx="110" cy="110" r="8" fill="#fff" opacity="0.4" />
      </Svg>
    </View>
  );
}

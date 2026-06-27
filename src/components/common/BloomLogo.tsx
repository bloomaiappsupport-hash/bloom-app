import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G, Defs, LinearGradient, Stop, RadialGradient } from 'react-native-svg';

interface BloomLogoProps {
  size?: number;
}

export default function BloomLogo({ size = 80 }: BloomLogoProps) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const petalR = s * 0.22;
  const orbitR = s * 0.2;
  const coreR = s * 0.13;

  // 6 petal centers arranged in a hexagon
  const petals = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    return {
      x: cx + orbitR * Math.cos(angle),
      y: cy + orbitR * Math.sin(angle),
    };
  });

  return (
    <View style={{ width: s, height: s }}>
      <Svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <Defs>
          <LinearGradient id="petalGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#9D5CF5" stopOpacity="1" />
            <Stop offset="1" stopColor="#4C1D95" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="petalGrad2" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#06D6A0" stopOpacity="0.9" />
            <Stop offset="1" stopColor="#7C3AED" stopOpacity="0.9" />
          </LinearGradient>
          <RadialGradient id="coreGrad" cx="50%" cy="35%" r="60%">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="1" stopColor="#C4B5FD" stopOpacity="0.8" />
          </RadialGradient>
        </Defs>

        {/* Outer glow ring */}
        <Circle cx={cx} cy={cy} r={s * 0.44} fill="#7C3AED" opacity={0.08} />
        <Circle cx={cx} cy={cy} r={s * 0.38} fill="#7C3AED" opacity={0.1} />

        {/* Petals — alternating gradients */}
        {petals.map((p, i) => (
          <Circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={petalR}
            fill={i % 2 === 0 ? 'url(#petalGrad)' : 'url(#petalGrad2)'}
            opacity={0.88}
          />
        ))}

        {/* Core white circle */}
        <Circle cx={cx} cy={cy} r={coreR} fill="url(#coreGrad)" />
      </Svg>
    </View>
  );
}

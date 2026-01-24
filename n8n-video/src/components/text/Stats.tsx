import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface Stat {
  value: string;
  label: string;
}

interface StatsProps {
  stats: Stat[];
  appearAt: number;
}

export const Stats: React.FC<StatsProps> = ({ stats, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (frame < appearAt) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: height / 2 - 60,
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      {stats.map((stat, index) => {
        const delay = index * 8;
        const progress = spring({
          frame: frame - appearAt - delay,
          fps,
          config: { damping: 12, stiffness: 100 },
        });

        const opacity = interpolate(progress, [0, 1], [0, 1]);
        const translateY = interpolate(progress, [0, 1], [40, 0]);
        const scale = interpolate(progress, [0, 1], [0.8, 1]);

        return (
          <div
            key={index}
            style={{
              opacity,
              transform: `translateY(${translateY}px) scale(${scale})`,
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.9)',
              padding: '24px 40px',
              borderRadius: 16,
              border: `2px solid ${theme.colors.primary}40`,
              boxShadow: `0 0 30px ${theme.colors.primary}20`,
            }}
          >
            <div
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: theme.colors.primary,
                fontFamily: theme.fonts.primary,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: theme.colors.textSecondary,
                fontFamily: theme.fonts.primary,
                marginTop: 8,
              }}
            >
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

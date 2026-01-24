import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface TitleProps {
  text: string;
  subtitle?: string;
  appearAt: number;
  disappearAt?: number;
}

export const Title: React.FC<TitleProps> = ({
  text,
  subtitle,
  appearAt,
  disappearAt,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  if (frame < appearAt) return null;
  if (disappearAt && frame > disappearAt) return null;

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const translateY = interpolate(entranceProgress, [0, 1], [-50, 0]);

  // Exit animation
  const exitOpacity = disappearAt
    ? interpolate(frame, [disappearAt - 20, disappearAt], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Subtitle delay
  const subtitleProgress = spring({
    frame: frame - appearAt - 10,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const subtitleOpacity = Math.max(0, interpolate(subtitleProgress, [0, 1], [0, 1]));

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: height / 2 - 80,
        textAlign: 'center',
        opacity: exitOpacity,
      }}
    >
      <h1
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.primary,
          margin: 0,
          opacity,
          transform: `translateY(${translateY}px)`,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        {text}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: theme.colors.primary,
            fontFamily: theme.fonts.primary,
            margin: '20px 0 0 0',
            opacity: subtitleOpacity,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

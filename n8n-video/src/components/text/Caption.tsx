import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface CaptionProps {
  text: string;
  appearAt: number;
  disappearAt?: number;
  position?: 'top' | 'center' | 'bottom';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  highlight?: boolean;
}

export const Caption: React.FC<CaptionProps> = ({
  text,
  appearAt,
  disappearAt,
  position = 'bottom',
  size = 'medium',
  highlight = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  if (frame < appearAt) return null;
  if (disappearAt && frame > disappearAt) return null;

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  // Exit animation
  const exitProgress = disappearAt
    ? interpolate(frame, [disappearAt - 10, disappearAt], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const opacity = entranceProgress * exitProgress;
  const translateY = interpolate(entranceProgress, [0, 1], [30, 0]);

  const fontSizes = {
    small: 28,
    medium: 36,
    large: 48,
    xlarge: 64,
  };

  const positions = {
    top: 120,
    center: height / 2 - 50,
    bottom: height - 180,
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: positions[position],
        textAlign: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          padding: '16px 32px',
          background: highlight
            ? `linear-gradient(135deg, ${theme.colors.primary}20, ${theme.colors.primary}40)`
            : 'rgba(15, 23, 42, 0.85)',
          borderRadius: 12,
          border: highlight
            ? `2px solid ${theme.colors.primary}`
            : '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontSize: fontSizes[size],
            fontWeight: 700,
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.primary,
            lineHeight: 1.4,
            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
          }}
        >
          {text}
        </span>
      </span>
    </div>
  );
};

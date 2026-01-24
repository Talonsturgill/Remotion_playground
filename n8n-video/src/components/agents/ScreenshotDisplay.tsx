import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { theme } from '../../theme';

interface ScreenshotDisplayProps {
  src: string;
  title: string;
  appearAt: number;
  disappearAt?: number;
  scale?: number;
}

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = ({
  src,
  title,
  appearAt,
  disappearAt,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (frame < appearAt) return null;
  if (disappearAt && frame > disappearAt) return null;

  const localFrame = frame - appearAt;

  const entranceProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const scaleAnim = interpolate(entranceProgress, [0, 1], [0.9, 1]) * scale;

  // Exit animation
  const exitOpacity = disappearAt
    ? interpolate(frame, [disappearAt - 15, disappearAt], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scaleAnim})`,
        opacity: opacity * exitOpacity,
      }}
    >
      {/* Monitor frame */}
      <div
        style={{
          background: '#0a0a0f',
          borderRadius: 16,
          border: `3px solid ${theme.colors.primary}50`,
          overflow: 'hidden',
          boxShadow: `0 0 80px ${theme.colors.primary}30, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: theme.colors.backgroundLight,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: `1px solid ${theme.colors.surface}`,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E' }} />
          <span
            style={{
              marginLeft: 16,
              fontSize: 16,
              fontWeight: 700,
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.primary,
              letterSpacing: 0.5,
            }}
          >
            {title}
          </span>
        </div>

        {/* Screenshot */}
        <Img
          src={staticFile(src)}
          style={{
            display: 'block',
            maxWidth: 900,
            maxHeight: 500,
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
};

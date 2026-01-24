import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface PromptHighlightProps {
  text: string;
  source: string;
  appearAt: number;
  disappearAt?: number;
}

export const PromptHighlight: React.FC<PromptHighlightProps> = ({
  text,
  source,
  appearAt,
  disappearAt,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (frame < appearAt) return null;
  if (disappearAt && frame > disappearAt) return null;

  // Typewriter effect
  const charsToShow = Math.floor((frame - appearAt) / 1.5);
  const displayText = text.slice(0, charsToShow);
  const showCursor = (frame - appearAt) % 20 < 10;

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const scale = interpolate(entranceProgress, [0, 1], [0.95, 1]);

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
        left: 80,
        right: 80,
        top: height / 2 - 100,
        opacity: opacity * exitOpacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Terminal-style container */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.9)',
          borderRadius: 16,
          border: `2px solid ${theme.colors.nodeAI}`,
          overflow: 'hidden',
          boxShadow: `0 0 40px ${theme.colors.nodeAI}40`,
        }}
      >
        {/* Terminal header */}
        <div
          style={{
            background: theme.colors.backgroundLight,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: `1px solid ${theme.colors.surface}`,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E' }} />
          <span
            style={{
              marginLeft: 12,
              fontSize: 14,
              color: theme.colors.textMuted,
              fontFamily: theme.fonts.mono,
            }}
          >
            {source}
          </span>
        </div>

        {/* Terminal content */}
        <div
          style={{
            padding: '24px 28px',
            minHeight: 120,
          }}
        >
          <span
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: theme.colors.nodeAI,
              fontFamily: theme.fonts.mono,
              lineHeight: 1.5,
            }}
          >
            "{displayText}
            {showCursor && displayText.length < text.length && (
              <span style={{ color: theme.colors.primary }}>|</span>
            )}
            {displayText.length >= text.length && '"'}
          </span>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface LogoProps {
  appearAt?: number;
  position?: 'corner' | 'center' | 'bottom';
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({
  appearAt = 0,
  position = 'corner',
  size = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (frame < appearAt) return null;

  const entranceProgress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const scale = interpolate(entranceProgress, [0, 1], [0.8, 1]);

  // Slow rotation animation for the circular arrows
  const rotation = (frame - appearAt) * 0.3;

  const positionStyles =
    position === 'corner'
      ? { top: 40, right: 40 }
      : position === 'bottom'
      ? { bottom: 60, left: width / 2 - size }
      : { top: height / 2 - size, left: width / 2 - size };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Transform Labs Logo - Circuit L with circular arrows */}
      <svg
        width={size * 2}
        height={size * 2}
        viewBox="0 0 100 100"
        style={{ overflow: 'visible' }}
      >
        {/* Circular dashed line with arrows */}
        <g transform={`rotate(${rotation}, 50, 50)`}>
          <circle
            cx="50"
            cy="50"
            r="42"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="8 6"
            opacity="0.9"
          />
          {/* Arrow heads at top and bottom */}
          <polygon
            points="8,48 8,52 3,50"
            fill="white"
          />
          <polygon
            points="92,48 92,52 97,50"
            fill="white"
          />
        </g>

        {/* Circuit L shape - angled bracket style */}
        <g transform="translate(28, 25)">
          {/* Main L/bracket shape */}
          <path
            d="M 8 0 L 0 12 L 0 38 L 8 50 L 16 50 L 8 38 L 8 12 L 16 0 Z"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M 28 0 L 36 12 L 36 38 L 28 50 L 20 50 L 28 38 L 28 12 L 20 0 Z"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Connection nodes */}
          <circle cx="12" cy="0" r="5" fill="white" />
          <circle cx="4" cy="25" r="5" fill="white" />
          <circle cx="12" cy="50" r="5" fill="white" />
        </g>
      </svg>

      {/* Text */}
      {(position === 'center' || position === 'bottom') && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 16,
            fontFamily: theme.fonts.primary,
            fontWeight: 700,
            fontSize: position === 'bottom' ? 22 : 28,
            color: 'white',
            letterSpacing: 2,
          }}
        >
          TRANSFORM LABS
        </div>
      )}
    </div>
  );
};

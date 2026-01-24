import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface LogoProps {
  appearAt?: number;
  position?: 'corner' | 'center';
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

  // Rotation animation for the circular arrows
  const rotation = (frame - appearAt) * 0.5;

  const positionStyles =
    position === 'corner'
      ? { top: 40, right: 40 }
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
      {/* Transform Labs Logo - Circuit T with circular arrows */}
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
            opacity="0.8"
          />
          {/* Arrow heads */}
          <polygon
            points="90,45 95,50 90,55"
            fill="white"
          />
          <polygon
            points="10,55 5,50 10,45"
            fill="white"
          />
        </g>

        {/* Circuit T shape */}
        <g transform="translate(25, 28)">
          {/* Main T shape */}
          <path
            d="M 0 12 L 50 12 L 50 8 L 28 8 L 28 44 L 22 44 L 22 8 L 0 8 Z"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Connection nodes */}
          <circle cx="0" cy="10" r="5" fill="white" />
          <circle cx="50" cy="10" r="5" fill="white" />
          <circle cx="25" cy="44" r="5" fill="white" />
        </g>
      </svg>

      {/* Text */}
      {position === 'center' && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontFamily: theme.fonts.primary,
            fontWeight: 700,
            fontSize: 28,
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

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../theme';

interface LogoProps {
  appearAt?: number;
  position?: 'corner' | 'center' | 'bottom';
  size?: number;
  showText?: boolean;
}

// SVG Transform Labs Logo - stylized L with circuit/flow elements
const TransformLabsLogo: React.FC<{ size: number; variant?: 'blue' | 'white' }> = ({
  size,
  variant = 'blue'
}) => {
  const bgColor = variant === 'blue' ? theme.colors.primary : 'transparent';
  const strokeColor = variant === 'blue' ? 'white' : 'white';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Background circle for blue variant */}
      {variant === 'blue' && (
        <circle cx="50" cy="50" r="48" fill={bgColor} />
      )}

      {/* Outer dashed circle with arrows */}
      <circle
        cx="50" cy="50" r="38"
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeDasharray="8 4"
        opacity="0.8"
      />

      {/* Arrow at top of circle */}
      <polygon
        points="50,10 45,18 55,18"
        fill={strokeColor}
      />

      {/* Arrow at bottom left */}
      <polygon
        points="20,65 28,60 25,70"
        fill={strokeColor}
      />

      {/* L-shaped workflow icon */}
      <path
        d="M 40 30 L 40 55 L 65 55"
        fill="none"
        stroke={strokeColor}
        strokeWidth="4"
        strokeLinecap="square"
      />

      {/* Connection nodes (circles) */}
      <circle cx="40" cy="30" r="4" fill={strokeColor} />
      <circle cx="40" cy="55" r="4" fill={strokeColor} />
      <circle cx="65" cy="55" r="4" fill={strokeColor} />

      {/* Small connector dots */}
      <circle cx="52" cy="42" r="3" fill={strokeColor} opacity="0.7" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  appearAt = 0,
  position = 'corner',
  size = 60,
  showText = false,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (frame < appearAt) return null;

  const entranceProgress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1]);
  const scale = interpolate(entranceProgress, [0, 1], [0.8, 1]);

  const positionStyles =
    position === 'corner'
      ? { top: 40, right: 40 }
      : position === 'bottom'
      ? { bottom: 80, left: '50%', transform: `translateX(-50%) scale(${scale})` }
      : { top: height / 2 - size, left: '50%', transform: `translateX(-50%) scale(${scale})` };

  return (
    <div
      style={{
        position: 'absolute',
        ...positionStyles,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transform: position === 'corner' ? `scale(${scale})` : positionStyles.transform,
      }}
    >
      <TransformLabsLogo size={size * 2} variant="blue" />
      {position !== 'corner' && (
        <div
          style={{
            marginTop: 20,
            fontFamily: theme.fonts.primary,
            fontWeight: 800,
            fontSize: 32,
            color: 'white',
            letterSpacing: 3,
            textTransform: 'uppercase',
          }}
        >
          Transform Labs
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface ConnectionLineProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  appearAt: number;
  isActive?: boolean;
  color?: string;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  appearAt,
  isActive = false,
  color = theme.colors.primary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < appearAt) return null;

  // Calculate the draw progress
  const drawDuration = 20; // frames to draw
  const drawProgress = interpolate(
    frame - appearAt,
    [0, drawDuration],
    [0, 1],
    { extrapolateRight: 'clamp' }
  );

  // Calculate path
  const midX = (fromX + toX) / 2;
  const controlOffset = Math.abs(toX - fromX) * 0.5;

  // Curved path
  const pathD = `M ${fromX} ${fromY} C ${fromX + controlOffset} ${fromY}, ${toX - controlOffset} ${toY}, ${toX} ${toY}`;

  // Calculate total path length (approximation)
  const pathLength = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2)) * 1.5;

  // Data particle animation - subtle flowing dot
  const particleCycle = 45; // frames for one trip (1.5 seconds at 30fps)
  const particleFrame = (frame - appearAt - drawDuration) % particleCycle;
  const particleProgress = interpolate(particleFrame, [0, particleCycle], [0, 1]);

  // Calculate particle position along the bezier curve
  const t = particleProgress;
  const particleX =
    Math.pow(1 - t, 3) * fromX +
    3 * Math.pow(1 - t, 2) * t * (fromX + controlOffset) +
    3 * (1 - t) * Math.pow(t, 2) * (toX - controlOffset) +
    Math.pow(t, 3) * toX;
  const particleY =
    Math.pow(1 - t, 3) * fromY +
    3 * Math.pow(1 - t, 2) * t * fromY +
    3 * (1 - t) * Math.pow(t, 2) * toY +
    Math.pow(t, 3) * toY;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id={`gradient-${fromX}-${toX}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="50%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background line (subtle) */}
      <path
        d={pathD}
        fill="none"
        stroke={theme.colors.surface}
        strokeWidth="3"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - drawProgress)}
      />

      {/* Main line */}
      <path
        d={pathD}
        fill="none"
        stroke={isActive ? color : theme.colors.textMuted}
        strokeWidth="2"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - drawProgress)}
        filter={isActive ? 'url(#glow)' : undefined}
      />

      {/* Data particle - subtle flowing dot */}
      {isActive && drawProgress >= 1 && (
        <>
          {/* Glow trail */}
          <circle
            cx={particleX}
            cy={particleY}
            r="8"
            fill={color}
            opacity={0.4}
            filter="url(#glow)"
          />
          {/* Main particle */}
          <circle
            cx={particleX}
            cy={particleY}
            r="4"
            fill={color}
            filter="url(#glow)"
          />
          {/* Bright center */}
          <circle
            cx={particleX}
            cy={particleY}
            r="2"
            fill="white"
          />
        </>
      )}
    </svg>
  );
};

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Img, staticFile } from 'remotion';
import { theme } from '../theme';

interface LogoProps {
  appearAt?: number;
  position?: 'corner' | 'center' | 'bottom';
  size?: number;
  showText?: boolean;
}

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

  // Use the uploaded logo file
  const logoFile = showText ? 'Transform_Labs_Logo_E11_Text-Ba.webp' : 'Large_Logo.webp';

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
      <Img
        src={staticFile(logoFile)}
        style={{
          width: size * 2,
          height: 'auto',
          objectFit: 'contain',
        }}
      />
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

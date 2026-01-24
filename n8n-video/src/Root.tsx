import React from 'react';
import { Composition } from 'remotion';
import { N8nExplainer } from './compositions/N8nExplainer';
import { theme } from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="N8nExplainer"
        component={N8nExplainer}
        durationInFrames={theme.video.durationInSeconds * theme.video.fps}
        fps={theme.video.fps}
        width={theme.video.width}
        height={theme.video.height}
      />
    </>
  );
};

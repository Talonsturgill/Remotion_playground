# Remotion Skill

This skill enables Claude to create programmatic videos using Remotion - a framework for creating videos with React.

## What is Remotion?

Remotion lets you create videos using React components. You write code, and Remotion turns it into an MP4, WebM, or GIF.

## Project Setup

When starting a new Remotion project, use:

```bash
npx create-video@latest
```

Or add Remotion to an existing project:

```bash
npm install remotion @remotion/cli @remotion/player
```

## Core Concepts

### 1. Composition

A Composition defines a video's dimensions, duration, and framerate:

```tsx
import { Composition } from "remotion";
import { MyVideo } from "./MyVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MyVideo"
      component={MyVideo}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### 2. useCurrentFrame and useVideoConfig

These hooks let you animate based on the current frame:

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  const opacity = Math.min(1, frame / 30); // Fade in over 1 second

  return (
    <div style={{ opacity }}>
      Hello World!
    </div>
  );
};
```

### 3. Sequences

Use `<Sequence>` to control when elements appear:

```tsx
import { Sequence } from "remotion";

export const MyVideo: React.FC = () => {
  return (
    <>
      <Sequence from={0} durationInFrames={60}>
        <Title text="First Title" />
      </Sequence>
      <Sequence from={60} durationInFrames={60}>
        <Title text="Second Title" />
      </Sequence>
    </>
  );
};
```

### 4. Animation Helpers

Remotion provides `interpolate` and `spring` for smooth animations:

```tsx
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const AnimatedText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Linear interpolation
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Spring animation
  const scale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  return (
    <div style={{ opacity, transform: `scale(${scale})` }}>
      Animated!
    </div>
  );
};
```

### 5. Adding Media

```tsx
import { Video, Audio, Img, staticFile } from "remotion";

// Use staticFile() for files in the public folder
<Img src={staticFile("logo.png")} />
<Video src={staticFile("background.mp4")} />
<Audio src={staticFile("music.mp3")} />
```

### 6. AbsoluteFill

A helper component for full-screen positioning:

```tsx
import { AbsoluteFill } from "remotion";

export const MyVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "white" }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <h1>Centered Text</h1>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
```

## Running and Rendering

### Preview in browser:
```bash
npx remotion studio
```

### Render to MP4:
```bash
npx remotion render src/index.ts MyVideo out/video.mp4
```

### Render to GIF:
```bash
npx remotion render src/index.ts MyVideo out/video.gif
```

## Common Video Patterns

### Fade In/Out
```tsx
const frame = useCurrentFrame();
const { durationInFrames } = useVideoConfig();

const opacity = interpolate(
  frame,
  [0, 20, durationInFrames - 20, durationInFrames],
  [0, 1, 1, 0]
);
```

### Slide In from Left
```tsx
const translateX = interpolate(frame, [0, 30], [-100, 0], {
  extrapolateRight: "clamp",
});

<div style={{ transform: `translateX(${translateX}%)` }}>
```

### Text Typing Effect
```tsx
const text = "Hello World";
const charsShown = Math.floor(frame / 3);
const displayedText = text.slice(0, charsShown);
```

## File Structure

A typical Remotion project:
```
my-video/
├── src/
│   ├── index.ts          # Entry point with Compositions
│   ├── Root.tsx          # RemotionRoot component
│   └── compositions/
│       ├── MyVideo.tsx   # Video components
│       └── ...
├── public/               # Static assets (images, videos, audio)
├── package.json
└── remotion.config.ts    # Remotion configuration
```

## Tips

1. **Think in frames**: At 30fps, 1 second = 30 frames
2. **Use TypeScript**: Remotion works great with TypeScript for type safety
3. **Preview often**: Use `npx remotion studio` to see changes live
4. **Keep components pure**: Animations should be deterministic based on frame number
5. **Preload assets**: Use `prefetch()` for remote assets to avoid loading delays

## Resources

- Documentation: https://www.remotion.dev/docs/
- Examples: https://www.remotion.dev/docs/examples
- Templates: https://www.remotion.dev/templates

# Remotion Video Creator Skill

## Overview
This skill enables creating professional explainer videos for n8n workflows using Remotion. Given a JSON configuration, Claude will generate all necessary components, render the video via GitHub Actions, and deliver a downloadable MP4.

## Quick Start
When a user provides a video JSON config (or asks to create a video), follow this workflow:

1. **Parse the JSON config** - Extract video metadata, stages, branding, and assets
2. **Generate/update Remotion components** - Create the composition and all visual components
3. **Ensure assets are in place** - Verify logos, screenshots, music are in `n8n-video/public/`
4. **Commit and push** - Push to feature branch
5. **Trigger render** - Merge to main or instruct user to trigger GitHub Action
6. **Deliver** - Guide user to download the artifact

---

## JSON Configuration Schema

```json
{
  "video": {
    "title": "Video title for reference",
    "width": 1080,
    "height": 1080,
    "fps": 30,
    "durationInSeconds": 65
  },
  "branding": {
    "primaryColor": "#00A0E4",
    "companyName": "Transform Labs",
    "logoFile": "Large_Logo.webp",
    "logoWithTextFile": "Transform_Labs_Logo_E11_Text-Ba.webp"
  },
  "audio": {
    "backgroundMusic": "no-copyright-music-hip-hop-333685.mp3",
    "volume": 0.6
  },
  "stages": [
    {
      "id": "hook",
      "type": "title",
      "duration": 3,
      "content": {
        "title": "We automated our Twitter strategy.",
        "subtitle": "Here's how."
      }
    },
    {
      "id": "problem",
      "type": "captions",
      "duration": 4,
      "content": {
        "captions": [
          { "text": "Creating quality threads 3x a week?", "duration": 2 },
          { "text": "That's hours of work.", "duration": 2, "highlight": true }
        ]
      }
    },
    {
      "id": "stage1",
      "type": "workflow",
      "duration": 7,
      "content": {
        "title": "STAGE 1: Content Discovery",
        "nodes": [
          { "label": "M/W/F 9AM", "type": "trigger", "icon": "schedule", "position": "top-center" },
          { "label": "TechCrunch", "type": "integration", "icon": "rss" },
          { "label": "Wired", "type": "integration", "icon": "rss" },
          { "label": "MIT Tech", "type": "integration", "icon": "rss" },
          { "label": "Merge", "type": "flow", "icon": "merge", "position": "bottom-center" }
        ],
        "connections": "auto",
        "caption": "5 RSS feeds scan AI news"
      }
    },
    {
      "id": "stage2",
      "type": "ai-thinking",
      "duration": 9,
      "content": {
        "title": "STAGE 2: AI Topic Selection",
        "prompts": [
          { "text": "What does Transform Labs' audience care about?", "source": "Topic Selector Agent — Thinking..." },
          { "text": "What's NOT just hype?", "source": "Topic Selector Agent — Filtering..." }
        ],
        "agent": { "label": "Topic Selector", "type": "ai" },
        "caption": "One article selected."
      }
    },
    {
      "id": "stage3",
      "type": "agents",
      "duration": 13.5,
      "content": {
        "title": "STAGE 3: The AI Writers Room",
        "agents": [
          { "name": "Outliner", "description": "structures the thread" },
          { "name": "Writer", "description": "drafts each tweet" },
          { "name": "Critic", "description": "scores ruthlessly" },
          { "name": "Reviser", "description": "polishes the final draft" }
        ],
        "showWorkScreens": true,
        "sequentialActivation": true,
        "caption": "4 AI agents work together..."
      }
    },
    {
      "id": "stage4",
      "type": "quality-gate",
      "duration": 9,
      "content": {
        "title": "STAGE 4: The Quality Gate",
        "prompts": [
          { "text": "Be ruthless. Default to REJECT.", "source": "Quality Critic Agent Prompt" },
          { "text": "If you're unsure, it's not good enough.", "source": "Quality Critic Agent Prompt" }
        ],
        "scoreThreshold": 8,
        "caption": "Nothing ships until it scores 8 out of 10"
      }
    },
    {
      "id": "stage5",
      "type": "delivery",
      "duration": 8,
      "content": {
        "title": "STAGE 5: Human in the Loop",
        "screenshots": [
          { "file": "slack_pic2.png", "title": "Content HQ — Thread Ready for Review", "duration": 4 },
          { "file": "slack_pic.png", "title": "Slack — #marketing-twitter-posts", "duration": 4 }
        ],
        "captions": [
          { "text": "Thread lands in Content HQ", "duration": 2 },
          { "text": "One-click human approval", "duration": 2, "highlight": true },
          { "text": "Slack pings the team — Thread posted!", "duration": 4 }
        ]
      }
    },
    {
      "id": "results",
      "type": "stats",
      "duration": 11,
      "content": {
        "stats": [
          { "value": "3x", "label": "per week" },
          { "value": "8+", "label": "quality score" },
          { "value": "100%", "label": "automated" }
        ],
        "closingCaption": "Zero writer's block. Just results.",
        "showLogo": true
      }
    }
  ]
}
```

---

## Project Structure

```
n8n-video/
├── public/                          # Static assets (MUST commit these!)
│   ├── Large_Logo.webp              # Main logo
│   ├── Transform_Labs_Logo_E11_Text-Ba.webp  # Logo with text
│   ├── slack_pic.png                # Screenshot 1
│   ├── slack_pic2.png               # Screenshot 2
│   └── no-copyright-music-hip-hop-333685.mp3  # Background music
├── src/
│   ├── index.ts                     # Entry point - registers compositions
│   ├── theme.ts                     # Colors, fonts, video settings
│   ├── compositions/
│   │   └── N8nExplainer.tsx         # Main video composition
│   └── components/
│       ├── Logo.tsx                 # Logo component
│       ├── nodes/
│       │   └── WorkflowNode.tsx     # n8n-style workflow nodes
│       ├── canvas/
│       │   └── ConnectionLine.tsx   # Animated connection lines
│       ├── text/
│       │   ├── Caption.tsx          # Text captions
│       │   ├── Title.tsx            # Title screens
│       │   ├── Stats.tsx            # Statistics display
│       │   └── PromptHighlight.tsx  # AI prompt display
│       └── agents/
│           ├── AgentWorkScreen.tsx  # Agent "working" animation
│           └── ScreenshotDisplay.tsx # Screenshot in monitor frame
├── remotion.config.ts               # Remotion configuration
└── package.json
```

---

## Key Components Reference

### Theme (`src/theme.ts`)
```typescript
export const theme = {
  colors: {
    primary: '#00A0E4',        // Transform Labs blue
    primaryDark: '#0077b5',
    primaryLight: '#33b5eb',
    background: '#0F172A',     // Dark blue-gray
    surface: '#1E293B',
    textPrimary: '#F8FAFC',
    success: '#22C55E',
    warning: '#F59E0B',
  },
  fonts: {
    primary: 'Inter, system-ui, sans-serif',
  },
  video: {
    width: 1080,
    height: 1080,
    fps: 30,
    durationInSeconds: 65,
  },
};
```

### Frame Timing Pattern
```typescript
// 30fps - calculate frames from seconds
const FRAMES = {
  STAGE_START: secondsToFrames(startTime),  // startTime * 30
  STAGE_END: secondsToFrames(endTime),      // endTime * 30
};

// Use Sequences for timing
<Sequence from={FRAMES.STAGE_START} durationInFrames={FRAMES.STAGE_END - FRAMES.STAGE_START}>
  {/* Stage content */}
</Sequence>
```

### Animation Patterns
```typescript
// Smooth spring animation
const progress = spring({
  frame: localFrame,
  fps,
  config: { damping: 20, stiffness: 100, mass: 0.8 },
});

// Interpolate values
const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
const scale = interpolate(progress, [0, 1], [0.8, 1]);
```

### Loading Assets
```typescript
import { staticFile, Img, Audio } from 'remotion';

// Images
<Img src={staticFile('Large_Logo.webp')} />

// Audio
<Audio src={staticFile('music.mp3')} volume={0.6} />
```

---

## GitHub Actions Workflow

Located at `.github/workflows/render-video.yml`:

```yaml
name: Render Video

on:
  workflow_dispatch:  # Manual trigger
  push:
    branches: [main]
    paths: ['n8n-video/**']

jobs:
  render:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Chrome dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libcups2 \
            libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
            libxrandr2 libgbm1 libasound2t64 libpango-1.0-0 libcairo2 \
            libnss3 libnspr4 libxss1 fonts-liberation xdg-utils

      - name: Install dependencies
        working-directory: n8n-video
        run: npm install

      - name: Render video
        working-directory: n8n-video
        run: |
          mkdir -p out
          npx remotion render N8nExplainer out/video.mp4 --log=verbose

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: rendered-video
          path: n8n-video/out/video.mp4
          retention-days: 30
```

---

## Workflow Checklist

When creating a new video:

### 1. Assets Required
- [ ] Logo file (webp/png) → `n8n-video/public/`
- [ ] Screenshots for any real UI displays → `n8n-video/public/`
- [ ] Background music (mp3) → `n8n-video/public/`
- [ ] **CRITICAL**: Commit binary assets to git!

### 2. Code Updates
- [ ] Update `theme.ts` with brand colors
- [ ] Update composition in `src/compositions/`
- [ ] Update `src/index.ts` if adding new compositions
- [ ] Run `npx tsc --noEmit` to validate TypeScript

### 3. Render
- [ ] Commit and push to feature branch
- [ ] Create PR to main and merge
- [ ] Wait for GitHub Action to complete (~5-10 min)
- [ ] Download artifact from Actions tab

### 4. Delivery
- [ ] Unzip artifact
- [ ] Upload to Google Drive / Slack / social media

---

## Common Issues & Solutions

### "Could not find composition with ID"
- The render command has wrong composition name
- Check `src/index.ts` for registered composition IDs
- Use: `npx remotion render CompositionId out/video.mp4`

### "Failed to load resource: 404"
- Asset file not in `public/` folder
- Or asset not committed to git
- Run: `git ls-tree -r HEAD --name-only | grep -E "\.(png|webp|mp3)$"`

### "libasound2 not found" (Ubuntu 24.04)
- Use `libasound2t64` instead of `libasound2`

### Choppy animations
- Increase spring damping: `{ damping: 20, stiffness: 100, mass: 0.8 }`
- Extend transition durations

### Elements overlapping
- Adjust `appearAt` and `disappearAt` frame values
- Check z-index via component render order (later = on top)

---

## Example: Creating a New Video

User provides:
```json
{
  "video": { "title": "Email Automation", "durationInSeconds": 45 },
  "branding": { "primaryColor": "#FF5733", "companyName": "Acme Corp" },
  "stages": [
    { "type": "title", "content": { "title": "We automated email outreach" } },
    { "type": "workflow", "content": { "nodes": [...] } }
  ]
}
```

Claude will:
1. Update `theme.ts` with Acme Corp branding
2. Generate composition with specified stages
3. Calculate frame timings for 45-second video
4. Request any missing assets (logo, screenshots)
5. Commit, push, and guide through render process

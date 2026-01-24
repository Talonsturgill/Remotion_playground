# Transform Labs Video Generator

Programmatic video creation for n8n workflow explainers using [Remotion](https://remotion.dev).

## What is this?

This project automatically generates animated explainer videos for n8n workflows. Give it a workflow JSON, and it creates a polished 60-second video ready for LinkedIn.

**Built for Transform Labs** - uses our brand colors, logo, and casual tone.

## Features

- Animated workflow nodes with glow effects
- Data particles flowing along connection lines
- Typewriter-style code/prompt highlights
- Quality score animations
- Transform Labs branding throughout
- LinkedIn-optimized format (1080x1080, 60 seconds)

## Quick Start

```bash
cd n8n-video
npm install
npm run studio    # Preview in browser
npm run render    # Export to MP4
```

The rendered video will be saved to `n8n-video/out/video.mp4`.

## Project Structure

```
n8n-video/
├── src/
│   ├── components/
│   │   ├── nodes/          # Workflow node components
│   │   ├── canvas/         # Connection lines, particles
│   │   └── text/           # Captions, titles, stats
│   ├── compositions/       # Video compositions
│   ├── theme.ts            # Brand colors and styles
│   └── index.ts            # Entry point
├── public/                 # Static assets (logos, audio)
└── out/                    # Rendered videos
```

## Current Video: X Thread Automation

The first video showcases our automated Twitter/X thread creation workflow:

1. **Content Discovery** - 5 RSS feeds scan AI news (M/W/F at 9 AM)
2. **AI Topic Selection** - Picks the best article for a thread
3. **AI Writers Room** - Outliner → Writer → Critic → Reviser agents
4. **Quality Gate** - Loops until score hits 8/10 ("Be ruthless. Default to REJECT.")
5. **Publish & Notify** - Saves to Notion, pings Slack

## Requirements

- Node.js 18+
- npm

## Brand Guidelines

| Element | Value |
|---------|-------|
| Primary Color | `#00A0E4` (Transform Labs blue) |
| Background | `#0F172A` (dark slate) |
| Format | 1080x1080 square |
| Duration | ~60 seconds |
| Tone | Casual, no AI hype |

## License

Internal use - Transform Labs

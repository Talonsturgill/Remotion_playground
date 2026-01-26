# Transform Labs Video Generator

Automated video creation system for n8n workflow explainer videos using Remotion.

> **For Claude**: When creating videos, read this file + `.claude/skills/remotion-video-creator.md` for complete context.

---

## Quick Start

### Creating a New Video
1. Upload workflow JSON to `n8n-video/video-configs/`
2. Upload assets (logo, screenshots, music) to `n8n-video/public/`
3. Push to `main` → GitHub Action auto-renders → Download from Actions → Artifacts

### With Claude
Just say "make a video about [your workflow]" or upload a JSON config. Claude handles everything.

### Fully Automated (n8n)
Use the n8n workflow in `n8n-workflows/` to fully automate:
```
POST /webhook/generate-video + JSON → Wait 5-10 min → Get video.mp4
```
See `n8n-workflows/README.md` for setup instructions.

---

## Brand Guidelines

### Colors
```
Primary Blue:    #00A0E4  ← Main brand color, highlights, CTAs
Primary Dark:    #0077b5  ← Gradients, hover states
Primary Light:   #33b5eb  ← Accents
Background:      #0F172A  ← Video background (dark blue-gray)
Background Alt:  #0a0a12  ← Darker variant for gradients
Surface:         #1E293B  ← Cards, panels, nodes
Surface Light:   #334155  ← Lighter panels
Text Primary:    #F8FAFC  ← Main text (white)
Text Secondary:  #94A3B8  ← Muted text
Success:         #22C55E  ← Positive indicators, checkmarks
Warning:         #F59E0B  ← Caution, scores
Error:           #EF4444  ← Errors, rejects
```

### Typography
- **Font Family**: Inter, system-ui, sans-serif
- **Title**: 64-80px, weight 800, uppercase for stage labels
- **Subtitle**: 36-48px, weight 600
- **Body**: 24-32px, weight 500-600
- **Caption**: 28-36px, weight 600

### Logo Files
Located in `n8n-video/public/`:
| File | Usage | Size |
|------|-------|------|
| `Large_Logo.webp` | Corner watermark, end card | 120x120 default |
| `Transform_Labs_Logo_E11_Text-Ba.webp` | Alternative with text | Variable |

### Video Specs
| Property | Value |
|----------|-------|
| Dimensions | 1080x1080 (square) |
| Frame Rate | 30 fps |
| Duration | 60-65 seconds |
| Format | MP4 (H.264) |
| Platform | LinkedIn, Instagram, Twitter |

### Tone & Style
- Casual, confident, no AI hype
- Show real results, not promises
- "We automated X" not "AI can automate X"
- Highlight human-in-the-loop aspects

---

## Project Structure

```
Remotion_playground/
├── README.md                        ← YOU ARE HERE (design reference)
├── CLAUDE.md                        ← Quick instructions for Claude
├── .claude/skills/
│   └── remotion-video-creator.md    ← Full technical skill file
├── .github/workflows/
│   └── render-video.yml             ← Auto-render on push to main
└── n8n-video/
    ├── public/                      ← ⚠️ ALL ASSETS GO HERE
    │   ├── Large_Logo.webp          ← Main logo
    │   ├── Transform_Labs_Logo_E11_Text-Ba.webp
    │   ├── slack_pic.png            ← Screenshot: Thread Posted
    │   ├── slack_pic2.png           ← Screenshot: Thread Ready
    │   └── no-copyright-music-hip-hop-333685.mp3
    ├── src/
    │   ├── index.ts                 ← Composition registry
    │   ├── theme.ts                 ← Brand colors & settings
    │   ├── compositions/
    │   │   └── N8nExplainer.tsx     ← Main video composition
    │   └── components/
    │       ├── Logo.tsx
    │       ├── nodes/WorkflowNode.tsx
    │       ├── canvas/ConnectionLine.tsx
    │       ├── text/Caption.tsx
    │       ├── text/Title.tsx
    │       ├── text/Stats.tsx
    │       ├── text/PromptHighlight.tsx
    │       └── agents/
    │           ├── AgentWorkScreen.tsx
    │           └── ScreenshotDisplay.tsx
    ├── video-configs/
    │   ├── template.json            ← Blank template
    │   ├── simple-input-template.json ← Easy input format
    │   └── x-thread-automation.json ← Full example
    ├── remotion.config.ts
    └── package.json
```

---

## Video Structure Template

Standard 60-65 second explainer format:

| Time | Frames | Section | Content |
|------|--------|---------|---------|
| 0-3s | 0-90 | **HOOK** | Bold statement: "We automated X. Here's how." |
| 3-7s | 90-210 | **PROBLEM** | Pain point: "Doing X manually? That's hours." |
| 7-14s | 210-420 | **STAGE 1** | First workflow step (trigger + data sources) |
| 14-23s | 420-690 | **STAGE 2** | AI processing / selection |
| 23-36s | 690-1095 | **STAGE 3** | Core workflow (agents, transformations) |
| 36-45s | 1095-1365 | **STAGE 4** | Quality gate / validation |
| 45-53s | 1365-1605 | **STAGE 5** | Human approval + delivery |
| 53-65s | 1605-1950 | **RESULTS** | Stats + closing + logo |

---

## Component Reference

### WorkflowNode
n8n-style workflow node with icon, glow effect.
```tsx
<WorkflowNode
  label="Node Name"
  type="trigger|integration|ai|flow"
  icon="schedule|rss|ai|merge|quality"
  x={540} y={300}
  appearAt={30}
  isActive={true}
  scale={1}
/>
```

### ConnectionLine
Animated line with flowing data particle.
```tsx
<ConnectionLine
  fromX={540} fromY={300}
  toX={540} toY={500}
  appearAt={50}
  isActive={true}
/>
```

### Caption
Animated text overlay.
```tsx
<Caption
  text="Your caption text"
  appearAt={0}
  disappearAt={90}           // Optional
  position="top|center|bottom"
  size="medium|large|xlarge"
  highlight={false}          // Adds glow effect
/>
```

### Title
Large title with optional subtitle.
```tsx
<Title
  text="Main Title"
  subtitle="Optional subtitle"
  appearAt={0}
/>
```

### PromptHighlight
AI prompt display with typewriter effect.
```tsx
<PromptHighlight
  text="Be ruthless. Default to REJECT."
  source="Quality Critic Agent"
  appearAt={30}
  disappearAt={120}
/>
```

### ScreenshotDisplay
Real screenshot in macOS-style window frame.
```tsx
<ScreenshotDisplay
  src="screenshot.png"       // File in public/
  title="Window Title"
  appearAt={60}
  disappearAt={150}
  scale={0.95}
/>
```

### Stats
Results display with animated metrics.
```tsx
<Stats
  stats={[
    { value: "3x", label: "per week" },
    { value: "8+", label: "quality score" },
    { value: "100%", label: "automated" }
  ]}
  appearAt={0}
/>
```

### Logo
Brand logo with entrance animation.
```tsx
<Logo
  appearAt={0}
  position="corner|center|bottom"
  size={50}
  showText={false}
/>
```

### AgentWorkScreen
Simulated AI agent "working" display.
```tsx
<AgentWorkScreen
  type="outliner|writer|critic|reviser"
  appearAt={30}
  disappearAt={120}
/>
```

---

## Animation Guidelines

### Spring Config (smooth, no bounce)
```typescript
const progress = spring({
  frame: localFrame,
  fps,
  config: { damping: 20, stiffness: 100, mass: 0.8 },
});
```

### Interpolation (always clamp to prevent overshoot)
```typescript
const opacity = interpolate(
  frame, [0, 30], [0, 1],
  { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
);
```

### Frame Math
```typescript
const fps = 30;
const secondsToFrames = (s: number) => Math.round(s * fps);
// 7 seconds = 210 frames
```

### Timing Best Practices
- Elements should animate in over 15-30 frames (0.5-1 second)
- Hold static for at least 60 frames (2 seconds) for readability
- Fade out over 15-20 frames
- Stagger multiple elements by 5-10 frames

---

## Workflow JSON Format

### Simple Input (recommended)
```json
{
  "workflow": {
    "name": "Email Outreach Automation",
    "hook": "We automated cold outreach. Here's how.",
    "problem": "Writing personalized emails? Hours of work.",
    "trigger": { "what": "New lead in CRM", "when": "Real-time" },
    "steps": [
      { "name": "Lead Data", "type": "integration", "description": "Pull from HubSpot" },
      { "name": "Research", "type": "ai", "description": "AI researches company" },
      { "name": "Draft Email", "type": "ai", "description": "Personalized email draft" },
      { "name": "Review", "type": "human", "description": "Human approves", "screenshot": "review.png" },
      { "name": "Send", "type": "output", "description": "Sends via Gmail" }
    ],
    "results": [
      { "metric": "50+", "label": "emails/day" },
      { "metric": "3x", "label": "response rate" }
    ],
    "closing": "Personalized at scale. Zero copy-paste."
  },
  "branding": {
    "company": "Transform Labs",
    "color": "#00A0E4",
    "logo_filename": "Large_Logo.webp"
  }
}
```

---

## GitHub Actions Workflow

**Trigger**: Push to `main` (when `n8n-video/**` changes) OR manual dispatch

**Render Command**:
```bash
npx remotion render N8nExplainer out/video.mp4 --log=verbose
```

**Output**: Actions → [workflow run] → Artifacts → `rendered-video`

**Render Time**: ~5-10 minutes for 60-second video

---

## Existing Videos

### X Thread Automation ✅
- **File**: `n8n-video/video-configs/x-thread-automation.json`
- **Duration**: 65 seconds
- **Flow**: RSS feeds → AI topic selection → 4-agent writers room → Quality gate → Human approval → Slack

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Could not find composition" | Use `N8nExplainer` (defined in `src/index.ts`) |
| 404 for assets | Ensure file is in `public/` AND committed to git |
| Choppy animation | Increase spring damping: `{ damping: 20, stiffness: 100 }` |
| Elements overlap | Adjust `appearAt`/`disappearAt` frame values |
| TypeScript errors | Run `cd n8n-video && npx tsc --noEmit` |
| Ubuntu libasound2 | Already fixed in workflow (uses `libasound2t64`) |

---

## For Claude - Checklist

When creating a new video:

1. **Read** this README + `.claude/skills/remotion-video-creator.md`
2. **Check assets**: `ls n8n-video/public/` - request missing files
3. **Generate code**: Update `N8nExplainer.tsx` based on workflow JSON
4. **Validate**: `cd n8n-video && npx tsc --noEmit`
5. **Commit ALL**: `git add -A` (includes binary assets!)
6. **Push**: `git push -u origin [branch]`
7. **Merge to main**: Triggers render
8. **Guide download**: Actions → Artifacts → `rendered-video`

**Never push without validating. Never forget binary assets.**

---

## License

Internal use - Transform Labs

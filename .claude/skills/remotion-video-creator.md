# Remotion Video Creator Skill

## TLDR - What Claude Does

When user uploads a workflow JSON or describes a video:

1. **Parse** → Extract stages, branding, assets needed
2. **Check Assets** → Verify all required files exist in `n8n-video/public/`, ask user to upload ANY that are missing
3. **Generate Code** → Create/update the Remotion composition
4. **Validate** → Run `npx tsc --noEmit` before committing
5. **Commit ALL** → Stage everything including binary assets
6. **Push & Merge** → Push to branch, merge to main
7. **Wait** → Tell user to check Actions tab in ~5-10 min
8. **Deliver** → Guide to download artifact

**CRITICAL**: Never push without validating. Never forget binary assets. Never use wrong render command.

---

## Workflow JSON Schema

User provides this (or Claude generates from description):

```json
{
  "workflow": {
    "name": "Workflow Name",
    "description": "What this automation does",
    "trigger": "What starts it (schedule, webhook, etc.)",
    "steps": [
      { "name": "Step 1", "type": "trigger|integration|ai|flow", "description": "What it does" },
      { "name": "Step 2", "type": "ai", "description": "AI processing step" }
    ],
    "output": "Final result"
  },
  "branding": {
    "company": "Company Name",
    "primaryColor": "#00A0E4",
    "logo": "filename.webp"
  },
  "video": {
    "hook": "Attention-grabbing opening line",
    "problem": "Pain point this solves",
    "duration": 60
  },
  "assets": {
    "logo": "logo.webp",
    "screenshots": ["screen1.png", "screen2.png"],
    "music": "background.mp3"
  }
}
```

---

## Pre-Flight Checklist (DO THIS EVERY TIME)

Before writing any code, verify:

```bash
# 1. Check what assets exist
ls -la n8n-video/public/

# 2. Check what assets are needed (from JSON config)
# Compare against the config's assets section

# 3. If ANY assets are missing, STOP and ask user to upload them to:
#    n8n-video/public/
```

**Missing assets = render failure. Always check first.**

---

## Asset Requirements

### Required for EVERY video:
| Asset | Format | Location | Notes |
|-------|--------|----------|-------|
| Logo | .webp or .png | `n8n-video/public/` | Used in corner + end card |
| Music | .mp3 | `n8n-video/public/` | Background track, ~0.6 volume |

### Optional per video:
| Asset | Format | Location | Notes |
|-------|--------|----------|-------|
| Screenshots | .png | `n8n-video/public/` | Real UI screenshots for credibility |
| Logo with text | .webp | `n8n-video/public/` | For end card if different from main logo |

### How to get assets from user:
User CANNOT upload binary files through chat. They must:
1. Upload directly to GitHub (`n8n-video/public/` folder)
2. Or provide a URL Claude can fetch from

**Tell user exactly what files are needed and where to put them.**

---

## Code Generation

### Video Structure (standard template)

```
0-3s     HOOK         - Bold statement that grabs attention
3-7s     PROBLEM      - Pain point the audience relates to
7-20s    STAGE 1      - First part of the workflow
20-35s   STAGE 2-3    - Middle stages (AI agents, processing)
35-45s   STAGE 4      - Quality gate / validation
45-55s   STAGE 5      - Delivery / human approval
55-65s   RESULTS      - Stats + logo + CTA
```

### Frame Calculation
```typescript
const fps = 30;
const secondsToFrames = (s: number) => s * fps;

// Example: Stage from 7s to 14s
const STAGE1_START = secondsToFrames(7);  // 210
const STAGE1_END = secondsToFrames(14);   // 420
```

### Component Usage

```typescript
// Workflow nodes
<WorkflowNode label="Name" type="trigger|integration|ai|flow" icon="schedule|rss|ai|merge" x={x} y={y} appearAt={frame} isActive={boolean} />

// Connections with flowing animation
<ConnectionLine fromX={x1} fromY={y1} toX={x2} toY={y2} appearAt={frame} isActive={boolean} />

// Text
<Title text="Main text" subtitle="Optional" appearAt={frame} />
<Caption text="Caption" appearAt={frame} disappearAt={frame} position="top|center|bottom" size="medium|large|xlarge" highlight={boolean} />

// AI prompts
<PromptHighlight text="Prompt text" source="Agent Name" appearAt={frame} disappearAt={frame} />

// Stats
<Stats stats={[{value: "3x", label: "faster"}]} appearAt={frame} />

// Screenshots
<ScreenshotDisplay src="filename.png" title="Window Title" appearAt={frame} disappearAt={frame} />

// Logo
<Logo appearAt={frame} position="corner|center|bottom" size={50} />

// Audio
<Audio src={staticFile('music.mp3')} volume={0.6} />
```

### Animation Best Practices
```typescript
// Smooth springs (no choppiness)
const progress = spring({
  frame: localFrame,
  fps,
  config: { damping: 20, stiffness: 100, mass: 0.8 },
});

// Always clamp interpolations
const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
```

---

## Validation (MANDATORY)

Before committing, ALWAYS run:

```bash
cd /home/user/Remotion_playground/n8n-video && npx tsc --noEmit
```

If errors → fix them before proceeding.

---

## Git Workflow

```bash
# 1. Stage EVERYTHING (especially binary assets!)
git add -A

# 2. Verify assets are staged
git status
# Should see: new file: n8n-video/public/logo.webp (etc)

# 3. Commit with descriptive message
git commit -m "Add [video name] - [brief description]"

# 4. Push to feature branch
git push -u origin claude/add-remotion-skill-mW5Tk

# 5. Merge to main (triggers render)
# Either create PR or guide user to merge
```

---

## GitHub Actions

The workflow at `.github/workflows/render-video.yml` auto-renders on push to main.

**Render command** (already configured):
```bash
npx remotion render N8nExplainer out/video.mp4 --log=verbose
```

**DO NOT** include entry file in render command - Remotion auto-detects.

**Render time**: ~5-10 minutes for 60-second video

**Output**: Download from Actions → [workflow run] → Artifacts → `rendered-video`

---

## Troubleshooting Quick Reference

| Error | Cause | Fix |
|-------|-------|-----|
| `Could not find composition` | Wrong composition ID | Use `N8nExplainer` (check src/index.ts) |
| `404 Not Found` for asset | File not in public/ or not committed | Add file, `git add -A`, commit |
| `libasound2 not found` | Ubuntu 24.04 | Use `libasound2t64` in workflow |
| Choppy animation | Low damping | Use `{ damping: 20, stiffness: 100, mass: 0.8 }` |
| Elements overlap | Wrong timing | Adjust `appearAt`/`disappearAt` frames |
| TypeScript error | Bad code | Run `npx tsc --noEmit`, fix errors |

---

## Complete Example Flow

**User says**: "Make a video for my email outreach automation"

**Claude does**:

1. **Ask for details** (if not provided):
   - What triggers it?
   - What are the steps?
   - What's the output?
   - Company name & brand color?

2. **Generate JSON config** from their answers

3. **Check assets**:
   ```bash
   ls n8n-video/public/
   ```
   → "I need you to upload your logo (webp/png) and any screenshots to GitHub at `n8n-video/public/`"

4. **Wait for assets**, then verify they exist

5. **Generate composition code** based on workflow steps

6. **Validate**:
   ```bash
   npx tsc --noEmit
   ```

7. **Commit all**:
   ```bash
   git add -A && git commit -m "Add email outreach video"
   ```

8. **Push & instruct merge**:
   ```bash
   git push -u origin claude/add-remotion-skill-mW5Tk
   ```
   → "Merge to main to trigger render"

9. **Guide to download**:
   → "Go to Actions → Render Video → Artifacts → rendered-video"

---

## Files Reference

```
Remotion_playground/
├── .claude/skills/remotion-video-creator.md  ← This file
├── .github/workflows/render-video.yml        ← GitHub Actions
├── CLAUDE.md                                  ← Project instructions
└── n8n-video/
    ├── public/                                ← ALL ASSETS GO HERE
    │   ├── Large_Logo.webp
    │   ├── slack_pic.png
    │   └── music.mp3
    ├── src/
    │   ├── index.ts                          ← Registers compositions
    │   ├── theme.ts                          ← Colors, fonts, settings
    │   ├── compositions/
    │   │   └── N8nExplainer.tsx              ← Main composition
    │   └── components/                        ← Reusable components
    ├── video-configs/                         ← JSON templates
    │   ├── template.json
    │   └── x-thread-automation.json
    └── package.json
```

---

## Remember

1. **Assets first** - Check they exist before coding
2. **Validate always** - Run tsc before committing
3. **Commit binaries** - `git add -A` catches everything
4. **Correct render command** - No entry file argument
5. **Guide user** - They download from GitHub Actions artifacts

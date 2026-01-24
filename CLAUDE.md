# Project Instructions for Claude

## Video Creation - Quick Start

When user wants to create a video, they can either:

### Option 1: Upload a JSON Config
If user uploads a JSON file or pastes JSON config, use the Remotion Video Creator skill at `.claude/skills/remotion-video-creator.md` to:
1. Parse the JSON configuration
2. Generate/update Remotion components
3. Ensure assets are uploaded to `n8n-video/public/`
4. Commit, push, and trigger render via GitHub Actions
5. Guide user to download the rendered video

### Option 2: Describe the Video
If user describes what they want, help them by:
1. Asking clarifying questions about content/branding
2. Creating a JSON config based on their description
3. Following the same workflow as Option 1

## JSON Config Templates

- **Full example**: `n8n-video/video-configs/x-thread-automation.json`
- **Blank template**: `n8n-video/video-configs/template.json`

## Skill Reference

Read `.claude/skills/remotion-video-creator.md` for:
- Complete JSON schema
- Project structure
- Component reference
- Animation patterns
- Troubleshooting guide
- GitHub Actions workflow

## Critical Reminders

1. **ALWAYS commit binary assets** (images, audio) to git - they won't exist in CI otherwise
2. **Run TypeScript check** before pushing: `cd n8n-video && npx tsc --noEmit`
3. **Assets go in** `n8n-video/public/` folder
4. **Render command**: `npx remotion render N8nExplainer out/video.mp4`
5. **Video downloads** from GitHub Actions → Artifacts section

## Project Context

This is a Remotion playground for creating programmatic explainer videos using React. The primary use case is creating LinkedIn/social media videos explaining n8n automation workflows.

### Tech Stack
- **Remotion** - React-based video creation
- **TypeScript** - Type-safe components
- **GitHub Actions** - Automated rendering
- **Transform Labs branding** - Primary color #00A0E4

### Video Specs (default)
- 1080x1080 square format
- 30 fps
- 60-65 seconds duration
- MP4 output

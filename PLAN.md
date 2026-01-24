# n8n Workflow Explainer Video System - Implementation Plan

## Goal
Create a system where you give Claude an n8n workflow JSON, and it automatically generates an engaging explainer video for Transform Labs' LinkedIn page.

---

## Research Summary

### n8n Workflow JSON Structure
Each workflow JSON contains:
- **nodes[]**: Array of nodes with `id`, `name`, `type`, `typeVersion`, `position` [x,y], `parameters`
- **connections{}**: Object mapping source node names to destination nodes
- **settings{}**: Workflow-level settings

Example structure:
```json
{
  "name": "My Workflow",
  "nodes": [
    {
      "id": "abc123",
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 200],
      "parameters": {...}
    }
  ],
  "connections": {
    "Webhook Trigger": {
      "main": [[{ "node": "Next Node", "type": "main", "index": 0 }]]
    }
  }
}
```

### LinkedIn Video Best Practices
| Spec | Recommendation |
|------|----------------|
| **Aspect Ratio** | 1:1 (square) or 4:5 (vertical) - takes up more screen space |
| **Resolution** | 1080x1080 (square) or 1080x1350 (4:5) |
| **Duration** | Under 60 seconds for max engagement |
| **Format** | MP4, H.264 codec |
| **Frame Rate** | 30 fps |
| **File Size** | 50-200 MB ideal |
| **Captions** | Required - videos autoplay muted |
| **Hook** | First 3 seconds must grab attention |

---

## Implementation Plan

### Phase 1: Core Video Components

#### 1.1 Create n8n Node Component Library
Build React components for common n8n nodes:
- **Trigger nodes**: Webhook, Schedule, Manual
- **Action nodes**: HTTP Request, Code, Set, IF, Switch
- **Integration nodes**: Slack, Google Sheets, OpenAI, etc.
- **Flow nodes**: Merge, Split, Loop

Each component should have:
- Recognizable icon (matching n8n's visual style)
- Node name display
- Animated "active" state (glowing, pulsing)
- Connection points (input/output dots)

#### 1.2 Create Workflow Canvas Component
- Parse JSON to extract nodes and connections
- Auto-layout nodes based on position data (or auto-calculate if needed)
- Draw animated connection lines between nodes
- Support zooming/panning for complex workflows

#### 1.3 Create Animation System
- **Node entrance**: Nodes fade/scale in one by one
- **Connection animation**: Lines draw from source to destination
- **Data flow**: Animated dots/particles flowing along connections
- **Highlight system**: Spotlight each node as it's explained

### Phase 2: Video Structure Template

#### 2.1 Standard Video Sections
```
[0-3s]   HOOK: Eye-catching title + problem statement
[3-8s]   INTRO: "Here's how we automated [X]"
[8-45s]  WALKTHROUGH: Animated node-by-node explanation
[45-55s] RESULTS: What this automation achieves
[55-60s] CTA: "Follow Transform Labs for more"
```

#### 2.2 Text Overlay System
- Large, bold captions (readable on mobile)
- Synced with node highlights
- Transform Labs branding (logo, colors)

#### 2.3 Audio Considerations
- Background music (optional, royalty-free)
- Sound effects for node activations
- Videos work without sound (captions are key)

### Phase 3: JSON-to-Video Pipeline

#### 3.1 Workflow Parser
Create a parser that extracts from JSON:
- Workflow name and purpose
- List of nodes in execution order
- Node types and what they do
- Connection flow

#### 3.2 Script Generator
Auto-generate explanation script:
- Hook based on workflow purpose
- Per-node explanations based on node type
- Results summary

#### 3.3 Composition Builder
Dynamically create Remotion composition:
- Calculate duration based on number of nodes
- Generate animation timings
- Position text overlays

### Phase 4: Brand Assets

#### 4.1 Transform Labs Branding
- Logo placement (corner watermark)
- Brand colors in node highlights
- Consistent typography
- Outro slide with social handles

#### 4.2 Visual Style Guide
- Dark or light theme option
- Modern, clean aesthetic
- Smooth animations (spring physics)
- Professional but approachable

---

## File Structure

```
remotion-n8n-videos/
├── src/
│   ├── index.ts                 # Entry point
│   ├── Root.tsx                 # Remotion root
│   ├── compositions/
│   │   └── N8nExplainer.tsx     # Main video composition
│   ├── components/
│   │   ├── nodes/               # n8n node components
│   │   │   ├── TriggerNode.tsx
│   │   │   ├── ActionNode.tsx
│   │   │   ├── IntegrationNode.tsx
│   │   │   └── NodeBase.tsx
│   │   ├── canvas/
│   │   │   ├── WorkflowCanvas.tsx
│   │   │   ├── ConnectionLine.tsx
│   │   │   └── DataParticle.tsx
│   │   ├── text/
│   │   │   ├── Caption.tsx
│   │   │   ├── Title.tsx
│   │   │   └── CTA.tsx
│   │   └── branding/
│   │       ├── Logo.tsx
│   │       └── Watermark.tsx
│   ├── utils/
│   │   ├── parseWorkflow.ts     # JSON parser
│   │   ├── generateScript.ts    # Auto-script generator
│   │   └── layoutNodes.ts       # Auto-layout algorithm
│   └── styles/
│       └── theme.ts             # Colors, fonts, etc.
├── public/
│   ├── fonts/
│   ├── icons/                   # n8n node icons
│   └── audio/                   # Background music, SFX
├── workflows/                   # Sample workflow JSONs
└── out/                         # Rendered videos
```

---

## How It Will Work (User Flow)

1. **You provide**: n8n workflow JSON + optional context
   ```
   "Make a video for this workflow: [paste JSON]
   It's a lead scoring automation for our CRM."
   ```

2. **Claude will**:
   - Parse the JSON to understand the workflow
   - Generate an engaging script
   - Create/update React components
   - Render the video

3. **You get**: MP4 file ready for LinkedIn

---

## Next Steps (Priority Order)

1. **Set up Remotion project** - Initialize with npm, create basic structure
2. **Build NodeBase component** - Generic node with icon, name, animations
3. **Build ConnectionLine component** - Animated SVG paths
4. **Build WorkflowCanvas** - Layout and render nodes from JSON
5. **Create JSON parser** - Extract workflow data
6. **Build video composition** - Hook → Walkthrough → CTA structure
7. **Add branding** - Transform Labs logo, colors
8. **Test with real workflow** - Use one of your n8n agent workflows
9. **Iterate on style** - Make it visually stunning

---

## Example Output Vision

Imagine: A sleek, dark-themed video where nodes smoothly animate in, glowing connection lines pulse with "data" flowing through them, and crisp text explains each step. The Transform Labs logo sits subtly in the corner. In 45 seconds, viewers understand exactly what your automation does and why it's powerful.

---

## Questions to Consider

1. **Brand colors**: What are Transform Labs' primary colors?
2. **Logo**: Do you have an SVG/PNG logo to include?
3. **Tone**: Professional and corporate, or casual and fun?
4. **Music**: Want background music, or silent with captions only?

---

## First Video: X Thread Automation Workflow

We have our first workflow to create a video for! Here's the breakdown:

### Workflow Summary
**Name**: Weekly X Thread Automation
**Purpose**: Automatically creates high-quality Twitter/X threads from AI news
**Trigger**: Runs M/W/F at 9:00 AM EST

### Key Stages (for video narrative)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: Content Discovery                                              │
│  ─────────────────────────                                              │
│  • Schedule Trigger (M/W/F 9AM)                                         │
│  • 5 RSS Feeds: TechCrunch, Wired, MIT Tech Review, a16z, OhioX         │
│  • Merge → Deduplicate → Limit to 50 articles                           │
│  • Aggregate into single payload                                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: AI Topic Selection                                             │
│  ──────────────────────────                                              │
│  • Topic Selector Agent (Gemini)                                         │
│  • Picks the BEST article for a thread                                   │
│  • Considers: Transform Labs voice, contrarian angles, business impact   │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 3: Content Creation Pipeline                                      │
│  ─────────────────────────────────                                       │
│  • Outline Creator Agent (Claude) - structures the thread                │
│  • Thread Writer Agent (Claude) - writes actual tweets                   │
│  • Quality Critic Agent (Gemini) - scores and critiques                  │
│  • Thread Reviser Agent (Claude) - applies fixes                         │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 4: Quality Loop                                                   │
│  ───────────────────────                                                 │
│  • Quality Gate checks: Score ≥ 8/10 OR 4+ iterations                   │
│  • If not passing → loops back to Critic → Reviser                      │
│  • Prevents infinite loops while ensuring quality                        │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 5: Publish & Notify                                               │
│  ─────────────────────────                                               │
│  • Save to Notion "Content HQ" database                                  │
│  • Format message with thread preview                                    │
│  • Notify #marketing-twitter-posts Slack channel                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Video Script Draft (60 seconds)

**[0-3s] HOOK**
> "We automated our entire Twitter content strategy. Here's how."
> *Visual: Bold text animates in, Transform Labs logo*

**[3-8s] THE PROBLEM**
> "Creating quality threads 3x a week? That's hours of work."
> *Visual: Calendar showing M/W/F, clock ticking*

**[8-15s] STAGE 1 - DISCOVERY**
> "Every Monday, Wednesday, Friday at 9 AM, our system wakes up."
> *Visual: Schedule trigger pulses, 5 RSS feeds animate in and merge*
> "It scans 5 top AI news sources and finds the freshest stories."

**[15-22s] STAGE 2 - AI SELECTION**
> "Then AI picks the ONE article worth talking about."
> *Visual: Articles filter down to a single glowing choice*
> "Not clickbait. Stories that matter to CTOs."

**[22-35s] STAGE 3 - THE WRITER'S ROOM**
> "A team of AI agents takes over..."
> *Visual: Four agent nodes appear in sequence*
> "One outlines. One writes. One critiques. One revises."
> *Visual: Data flows between agents in a loop*

**[35-45s] STAGE 4 - QUALITY GATE**
> "Nothing ships until it scores 8 out of 10."
> *Visual: Quality gate with score meter, loop animation*
> "It'll revise up to 4 times to get it right."

**[45-52s] STAGE 5 - DELIVERY**
> "The finished thread lands in Notion, ready for review."
> *Visual: Notion and Slack icons, notification animation*
> "Our team gets a Slack ping. One click to publish."

**[52-60s] RESULTS + CTA**
> "3 quality threads a week. Zero writer's block."
> *Visual: Stats appear: "3x/week", "8+ quality score", "100% automated"*
> "This is what AI automation looks like."
> *Visual: Transform Labs logo + "Follow for more"*

### Node Types in This Workflow

| Node Type | Count | Component Needed |
|-----------|-------|------------------|
| Schedule Trigger | 1 | TriggerNode (clock icon) |
| RSS Feed Read | 5 | IntegrationNode (RSS icon) |
| Merge | 1 | FlowNode (merge icon) |
| Remove Duplicates | 1 | FlowNode (filter icon) |
| Limit | 1 | FlowNode (limit icon) |
| Aggregate | 1 | FlowNode (aggregate icon) |
| AI Agent (LangChain) | 6 | AgentNode (brain/robot icon) |
| Output Parser | 6 | UtilityNode (JSON icon) |
| LLM Chat Model | 4 | ModelNode (AI chip icon) |
| Set | 2 | ActionNode (variable icon) |
| If | 1 | FlowNode (branch icon) |
| Code | 3 | ActionNode (code icon) |
| Notion | 1 | IntegrationNode (Notion icon) |
| HTTP Request | 1 | ActionNode (globe icon) |
| Slack | 2 | IntegrationNode (Slack icon) |
| Sticky Note | 4 | (Skip in video - just documentation) |
| Think Tool | 6 | (Skip - internal to agents) |

### Visual Style for This Video

**Color Palette** (suggestion):
- Background: Dark (#0F172A - slate-900)
- Primary accent: Electric blue (#3B82F6)
- Secondary: Purple (#8B5CF6) for AI/agent nodes
- Success: Green (#22C55E) for quality passing
- Warning: Orange (#F59E0B) for revision loop

**Animation Ideas**:
- Nodes "boot up" with a subtle glow
- Connection lines draw with a trailing glow effect
- Data particles (small dots) flow along connections
- Quality score animates like a filling meter
- Loop animation shows the revision cycle clearly

---

## Ready to Build?

With this plan and real workflow example, we can start building the Remotion project. The next step is to:

1. Initialize the Remotion project structure
2. Create the first node components
3. Build a working prototype for this X Thread workflow

Let me know when you want to start coding!

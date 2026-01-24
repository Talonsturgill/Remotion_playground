# n8n Video Generator Workflow

Automated video generation: **Input workflow JSON → Get rendered video**

## How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Webhook   │────▶│  Claude API │────▶│   GitHub    │────▶│   Return    │
│ (JSON input)│     │ (gen code)  │     │  (render)   │     │   Video     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

1. **Webhook** receives your workflow JSON
2. **Claude API** generates Remotion composition code
3. **GitHub API** commits code, triggers render action
4. **Polls** until render completes (~5-10 min)
5. **Downloads** artifact and returns video

---

## Setup

### 1. Import Workflow

1. Open n8n
2. Go to **Workflows** → **Import from File**
3. Select `video-generator-workflow.json`

### 2. Configure Credentials

#### Anthropic API
1. **Credentials** → **New** → **Header Auth**
2. Name: `Anthropic API`
3. Header Name: `x-api-key`
4. Header Value: Your Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

#### GitHub API
1. **Credentials** → **New** → **Header Auth**
2. Name: `GitHub API`
3. Header Name: `Authorization`
4. Header Value: `Bearer ghp_YOUR_GITHUB_TOKEN`

To create a GitHub token:
1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Create token with permissions:
   - **Contents**: Read and write
   - **Actions**: Read and write

### 3. Set Environment Variables

In n8n, set these environment variables:
```
GITHUB_OWNER=Talonsturgill
GITHUB_REPO=Remotion_playground
```

Or update the workflow nodes directly with your repo info.

### 4. Activate Workflow

Click **Active** toggle to enable the webhook.

---

## Usage

### Send a Request

```bash
curl -X POST https://your-n8n-instance.com/webhook/generate-video \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "name": "Lead Enrichment",
      "hook": "We automated lead research. Here'\''s how.",
      "problem": "Researching every lead manually? Hours wasted.",
      "trigger": { "what": "New lead in HubSpot", "when": "Real-time" },
      "steps": [
        { "name": "HubSpot", "type": "trigger", "description": "New contact created" },
        { "name": "Clearbit", "type": "integration", "description": "Enrich with company data" },
        { "name": "GPT-4", "type": "ai", "description": "Generate personalized intro" },
        { "name": "HubSpot", "type": "output", "description": "Update contact with insights" }
      ],
      "results": [
        { "metric": "100+", "label": "leads/day" },
        { "metric": "5min", "label": "per lead → 0" }
      ],
      "closing": "Every lead enriched. Zero manual research."
    },
    "branding": {
      "company": "Transform Labs",
      "color": "#00A0E4"
    }
  }'
```

### Response

Returns a ZIP file containing `video.mp4` (~5-10 minute wait).

---

## Input JSON Schema

```json
{
  "workflow": {
    "name": "Workflow Name",
    "hook": "Opening line for video",
    "problem": "Pain point statement",
    "trigger": {
      "what": "What triggers it",
      "when": "When/how often"
    },
    "steps": [
      {
        "name": "Step Name",
        "type": "trigger|integration|ai|human|output",
        "description": "What this step does"
      }
    ],
    "results": [
      { "metric": "3x", "label": "faster" }
    ],
    "closing": "Closing statement"
  },
  "branding": {
    "company": "Company Name",
    "color": "#HEX"
  }
}
```

---

## Customization

### Add Screenshots
If your workflow needs screenshots:
1. Upload images to `n8n-video/public/` in the GitHub repo
2. Reference them in your JSON:
```json
{
  "steps": [
    {
      "name": "Review",
      "type": "human",
      "description": "Manager approves",
      "screenshot": "approval-screen.png"
    }
  ]
}
```

### Change Music
1. Upload new MP3 to `n8n-video/public/`
2. Update the workflow or let Claude know to use a different file

### Different Branding
Just change the `branding` object in your request - Claude adapts the colors.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check API credentials |
| Timeout | Render takes 5-10 min, increase n8n timeout |
| Empty response | Check GitHub Actions for errors |
| Bad video | Review Claude's generated code in the commit |

---

## Architecture Details

### Workflow Nodes

1. **Webhook**: POST `/webhook/generate-video`
2. **Build Prompt**: Constructs Claude prompt with skill context
3. **Claude API**: Generates N8nExplainer.tsx code
4. **Extract Code**: Cleans up Claude's response
5. **Get SHA**: Gets current file SHA for GitHub commit
6. **Commit**: Pushes new composition to main branch
7. **Wait**: Pauses for GitHub Action to start
8. **Poll Loop**: Checks action status every 30s
9. **Download**: Fetches artifact when complete
10. **Respond**: Returns ZIP with video

### Claude Prompt Structure

The prompt includes:
- Full Remotion skill context
- Component reference
- Animation guidelines
- Brand colors
- The user's workflow JSON

Claude outputs raw TypeScript that gets committed directly.

---

## Files

```
n8n-workflows/
├── README.md                      ← This file
└── video-generator-workflow.json  ← Import this into n8n
```

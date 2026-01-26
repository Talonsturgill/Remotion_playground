---
title: "Claude — LinkedIn Skill"
status: "draft"
version: "0.1"
date: "2026-01-26"
author: "Talonsturgill"
tags:
  - claude
  - linkedin
  - marketing
  - skill
---

# Claude — LinkedIn Skill

Status: Draft

## Overview

This skill focuses on generating LinkedIn-optimized content using Claude: posts, article outlines, outreach messages, employee advocacy content, and performance-aware variants. It includes templated prompts, personalization patterns, n8n workflow steps, and moderation/approval guidance.

## Use-cases

- Drafting thought-leadership posts and long-form articles
- Personalized outreach and follow-up sequences
- Employee advocacy kits (post + caption + image prompt)
- Repurposing blog posts into LinkedIn content

## Best practices for LinkedIn

- Hook in the first sentence — front-load value.
- Use concise paragraphs and bullet points.
- Prefer actionable insights and avoid hyperbolic claims.
- Tagging people/companies should be handled carefully and optionally added at publish time, not by the model.
- For outreach, personalize with tokens (first name, company, recent event).

## Prompt templates

Thought-leadership post:
```
Write 3 LinkedIn post variants about {topic}. Each should have:
- 1-line hook
- 2 short paragraphs
- 1 actionable takeaway
- 1 CTA
Tone: authoritative but approachable.
Output JSON: {"variants":[{"text":"...","cta":"..."}]}
```

Article outline:
```
Produce a detailed outline for a LinkedIn article titled "{title}". Include 5 sections, short summary per section, suggested word counts, and suggested images per section. Output JSON.
```

Personalized outreach message:
```
Given recipient: {first_name}, {company}, {recent_event}, write 3 outreach messages (connection request, followup 1, followup 2). Keep them concise and personalized. Output JSON.
```

Employee advocacy kit:
- Post caption variants
- Suggested image prompts
- Short guidance for employees (how to introduce, suggested hashtags, character limits)

## Tone & Personalization tokens

- Use placeholders in prompts for dynamic insertion: {{first_name}}, {{company}}, {{pain_point}}, {{metric}}.
- Keep a small set of tone presets (e.g., earnest, playful, expert).

## n8n workflow example

1. Trigger: Content brief or scheduled repurpose job
2. Set: populate tokens (topic, audience, campaign)
3. HTTP Request: Claude to generate variants
4. Function: parse JSON and assign variant IDs
5. Human approval step (Slack or Email webhook)
6. Publisher node (LinkedIn API / Buffer) or schedule in a calendar

## Compliance & Moderation

- Run a final QA step to check for unsubstantiated claims, legal/regulatory language, and PII.
- Keep an audit trail: store prompt, response, reviewer, and publish metadata.

## Metrics & Iteration

- When posts publish, collect engagement metrics and feed back top performers to Claude to "learn" preferred styles (via prompt engineering).
- Example feedback prompt: "Given these three top-performing posts, produce 5 new variants keeping the same tone and structure."

## Outreach sequences & limits

- Respect LinkedIn rate limits and the platform's anti-spam rules.
- Keep followups spaced and provide do-not-contact flags in the pipeline.

## Example JSON schema (LinkedIn post variant)

{
  "variants": [
    {
      "id": "ln-1",
      "text": "...",
      "cta": "...",
      "hashtags": ["#..."],
      "image_prompt": "..."
    }
  ]
}

## Troubleshooting

- If content feels generic: add contextual company/product details into the prompt and increase context tokens.
- For hallucinations: require citations or ask for "statements that are verified to be true" and run QA agent.

## Next steps

- Create a small pilot pipeline for one campaign: generate 5 posts, run a 1-round human review, schedule 3. Measure engagement and iterate on prompts.
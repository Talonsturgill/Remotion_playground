---
title: "Claude — Social Media Skill"
status: "draft"
version: "0.1"
date: "2026-01-26"
author: "Talonsturgill"
tags:
  - claude
  - social
  - marketing
  - captions
  - skill
---

# Claude — Social Media Skill

Status: Draft

## Overview

This skill gives practical patterns and prompt templates for generating platform-optimized social media content using Claude. It covers LinkedIn, Instagram, X/Twitter, TikTok captions, hashtag generation, image prompt engineering, A/B variants, and n8n scheduling patterns.

## Platform considerations

- LinkedIn: professional tone, up to ~3000 characters but keep concise for engagement.
- X/Twitter: short, use threads for long-form ideas.
- Instagram: visual-first, short caption + hashtags, consider first line hook.
- TikTok/YouTube Short: strong hook in first 3 seconds; generate caption + suggested on-screen text.
- Character limits and aspect-ratio/asset variants matter—include these in prompts.

## Templates & Prompt Patterns

General request (JSON output):
```
Produce N variants for platform P. For each variant return:
{
  "text": "...",
  "hashtags": ["#..."],
  "cta": "...",
  "tone": "friendly|professional|authoritative",
  "image_prompt": "..."
}
Constraints: length, target keywords, campaign UTM.
Return valid JSON only.
```

LinkedIn caption example:
```
Write 3 LinkedIn post variants about {topic}. Tone: professional and insightful. Each variant include a 1-2 sentence hook, 2 supporting bullets, a CTA, and 2 hashtags. Output JSON.
```

Instagram caption example:
```
Write 4 Instagram caption variants for {campaign}. Max first line 125 characters. Add 6-10 hashtags (separate list). Produce an alt-text suggestion and an image prompt for stable-diffusion. Output JSON.
```

Hashtag generation:
- Use a dedicated agent to produce primary hashtags, niche tags, and trending tags. Validate length and relevancy.

## Image prompt engineering

- When generating image prompts, include style, composition, color palette, focal point, quality tokens, and negative prompts:
  Example:
  ```
  "image_prompt": "High-contrast closeup of product on marble surface, soft natural light, shallow depth of field, cinematic color grade --no text --no watermarks"
  ```

- Provide multiple aspect ratio variants (1:1, 4:5, 16:9) by requesting variations.

## A/B & Variants

- Ask Claude to produce multiple variants with explicit differences (tone A vs B).
- Track variant IDs in your scheduling system and record performance metrics.

## n8n pipelines (pattern)

1. Content brief → Claude (generate variants) → Save variants to Sheet/DB → QA/Editor Agent → Asset generation (imagegen/TTS) → Scheduler.
2. Use SplitInBatches to create a publisher job per variant with rate limiting.

## Scheduling & UTM

- Generate tracking links and append UTM parameters in Claude output or in a separate function node.
- Store scheduled publish times and timezone metadata.

## Moderation & Safety

- Run a safety check agent to filter claims, profanity, and PII.
- Keep a manual override for high-risk content.

## Analytics feedback loop

- After publishing, ingest platform metrics (likes, comments, CTR) and feed top-performing posts back to Claude to generate more similar content or to refine prompts.

## Prompt library (examples)

1. Short hook: "Write 5 hook lines (<50 chars) for a post about {topic}. Tone: energetic."
2. Thread starter (X): "Create a 7-tweet thread that tells a short story about {topic}, each tweet 200 characters max. Output JSON: { 'tweets': [...] }"
3. Alt text generator: "Write alt text for this image: {image_description}. Keep under 125 characters."

## Cost & Throughput tips

- Pre-generate content for scheduled campaigns to avoid cost spikes.
- Cache accepted variants and image prompts.
- Use smaller models/shorter max_tokens for simple hashtag or alt-text tasks.

## Testing

- A/B test prompts and maintain a prompt-version registry.
- Mock Claude in staging to validate downstream parsing and scheduling.

## Example JSON response schema

{
  "variants": [
    {
      "id": "variant-1",
      "platform": "instagram",
      "text": "...",
      "hashtags": ["#..."],
      "image_prompt": "...",
      "cta": "..."
    }
  ]
}
---
title: "Claude — n8n Skill"
status: "draft"
version: "0.1"
date: "2026-01-26"
author: "Talonsturgill"
tags:
  - claude
  - n8n
  - automation
  - ai
  - skill
---

# Claude — n8n Skill

Status: Draft

## Overview

This skill documents practical patterns for integrating Anthropic Claude (or Claude-compatible API endpoints) into n8n workflows for marketing, social media, and content pipelines. It covers quick HTTP Request usage, batching, caching, structured outputs, error handling, and a minimal custom node example.

## Use-cases

- Generate marketing copy, social captions, and video scripts inside n8n.
- Build agent orchestration (draft → edit → schedule) with Claude as the writer/assistant.
- Bulk-enrich spreadsheets and content repositories.
- Create deterministic outputs for repeatable campaign renders.

## Architecture

- n8n workflow nodes produce prompts and call Claude (HTTP Request or a custom node).
- Optionally check cache (DB/Redis) before calling Claude.
- Parse structured responses (JSON) and route outputs to downstream nodes (Sheets, CMS, TTS, imagegen).
- Use a central orchestration pattern for multi-agent flows (see agent teams skill).

## Environment / Secrets

- CLAUDE_API_KEY — required
- CLAUDE_API_URL — optional; default: https://api.anthropic.com
- CLAUDE_MODEL — optional; default: claude-2 (or whichever you use)

In n8n expressions: {{$env.CLAUDE_API_KEY}}, {{$env.CLAUDE_API_URL}}

## Quickstart — HTTP Request node

1. Create or open a workflow.
2. Add a Set node with a `prompt` field (or map from trigger data).
3. Add an HTTP Request node:
   - Method: POST
   - URL: {{$env.CLAUDE_API_URL ? $env.CLAUDE_API_URL + "/v1/complete" : "https://api.anthropic.com/v1/complete"}}
   - Headers: Content-Type: application/json, x-api-key: {{$env.CLAUDE_API_KEY}}
   - Body Type: JSON
   - Body:
     - model: {{$env.CLAUDE_MODEL || "claude-2"}}
     - prompt: {{$json["prompt"]}}
     - max_tokens: 800
     - temperature: 0
4. Add a Function node to extract text from response:
   Example:
   ```
   const body = items[0].json;
   const text = body.completion || body.output || (body.choices && body.choices[0]?.text) || '';
   return [{ json: { text, raw: body } }];
   ```

## Structured JSON responses

- For robust parsing request JSON-only outputs:
  Example prompt prefix:
  ```
  You must output valid JSON only. Return:
  { "scenes": [ { "title": "...", "body": "...", "duration_seconds": 12 } ] }
  ```

- Use Function nodes with JSON.parse to convert returned strings into objects.

## Batching & Rate Limits

- Use SplitInBatches node to process arrays of prompts with controlled concurrency.
- On 429: use node-level retries or insert a Wait node before requeueing.
- For high volume, pre-generate content in scheduled jobs and cache results.

## Caching pattern (prompt -> response)

1. Hash the prompt (e.g., SHA256) in a Function node.
2. Query Redis/DB for the hash.
3. If present, return cached response.
4. Else call Claude, store response with metadata (prompt, model, temp, timestamp) and return it.

## Custom Node (outline)

- Build a reusable Claude node for organization-wide use.
- Provide input fields (prompt, model, temperature, max_tokens).
- Implement robust error handling, timeouts, and optional streaming support.

## Security & Secrets

- Avoid embedding API keys in nodes; use env vars or n8n credentials.
- Sanitize public inputs to prevent prompt injection.
- Log only metadata (no raw PII) or encrypt stored outputs.

## Testing & Monitoring

- Mock Claude responses in unit tests for Function nodes/custom nodes.
- Schedule health checks and monitor error rates and latency.
- Record cost metrics (calls per day, tokens), especially for campaign bursts.

## Example n8n workflow (pattern)

Trigger → Set(prompt) → Cache Check (DB) → Claude HTTP Request → JSON Parse → Editor/Approval Node → Save to CMS/Google Sheets → Scheduler/Publisher

## Prompt templates (marketing)

Short social caption:
```
Write 3 LinkedIn post variants (<=300 words each) promoting product X. Tone: professional, helpful. Include 2 hashtags and a short CTA. Output JSON: {"variants":[{"text": "..."}]}
```

Long-form script:
```
Produce a 60-second video script about {product}. Output JSON: {"scenes":[{"title":"", "body":"", "duration_seconds":12}]}
```

## Troubleshooting

- 401/403 → verify CLAUDE_API_KEY and header.
- 429 → backoff and batch.
- Unexpected format → enforce JSON-only and validate with JSON.parse.

## Contributing

- Keep prompts in version control.
- Provide reusable credential definitions for teams.
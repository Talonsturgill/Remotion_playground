---
title: "Claude — Agent Teams Skill"
status: "draft"
version: "0.1"
date: "2026-01-26"
author: "Talonsturgill"
tags:
  - claude
  - agents
  - orchestration
  - workflow
  - marketing
---

# Claude — Agent Teams Skill

Status: Draft

## Overview

This skill describes how to design, orchestrate, and run multiple Claude "agents" (roles) to build end-to-end marketing content pipelines: drafting, editing, creative direction, image prompt generation, scheduling, and publishing. It focuses on message protocol, state passing, verification, and how to implement orchestration in n8n.

## Agent Roles (examples)

- Writer Agent: produces initial drafts (posts, scripts, captions).
- Editor Agent: improves clarity, tone, and brand consistency; ensures compliance.
- SEO/Hashtag Agent: generates hashtags, SEO-friendly headlines, meta.
- Creative Agent: creates image prompts, alt text, and design copy.
- QA/Policy Agent: checks for brand/legal issues and toxicity.
- Scheduler/Publisher Agent: schedules posts, uploads assets, and reports results.

## Message Protocol & State

- Use a JSON message envelope between agents:
  {
    "id": "<uuid>",
    "role": "writer|editor|seo|creative|qa|publisher",
    "input": { ... },
    "output": { ... },
    "history": [ {role, message, timestamp} ],
    "status": "draft|review|approved|published"
  }

- Persist envelopes in a DB (Postgres, Airtable, or Sheets) so agents can resume or audit.

## Orchestration Patterns

1. Linear pipeline: Writer → Editor → QA → Publisher
   - Implement as chained n8n workflow or via queued tasks (Redis/DB).
2. Parallel agents with voting: multiple writer agents produce variants; editor/QA select best via scoring.
3. Iterative refinement loop: writer produces variants → editor requests rewrites until acceptance criteria met.

## Determinism & Cost Controls

- Set temperature = 0 for deterministic drafts when desired.
- Cache accepted outputs; avoid re-calling for identical prompts.
- Track tokens and limit iteration budget per item.

## Tools & Integrations

- Data storage: Postgres, Airtable, Google Sheets.
- Image generation: Stable Diffusion, Midjourney, or image provider APIs.
- TTS: ElevenLabs, AWS Polly, etc.
- Publishing: native platform APIs (LinkedIn, Twitter, Instagram), Buffer/Hootsuite, or CMS endpoints.
- Monitoring: Slack/Email notifications for failures or approvals.

## n8n Implementation Patterns

- Use a queue pattern: trigger → create envelope row → push job to queue or call next node.
- Use webhook or credentials-managed HTTP Request nodes to call Claude from each agent step.
- Use Function nodes to evaluate acceptance criteria and decide next step.

## Example orchestration (simple)

1. Trigger (new campaign row) → Writer (Claude) → Store draft → Editor (Claude) → Human review step (manual approval) → Publisher (schedule API)

## Evaluation & Scoring

- Add scoring agent that checks readability, CTA clarity, length, compliance with character limits, and SEO heuristics.
- Use a Claude agent to compute scores and return an array of metrics, e.g.
  { "readability": 8.7, "length_ok": true, "cta_strength": 7.5 }

## Safety & Governance

- Use QA agent to perform content policy checks (PII exposure, claims, offensive content).
- Maintain audit logs of prompts, responses, and model metadata for traceability.
- Implement human-in-loop for high-risk content.

## Prompting conventions for multi-agent pipelines

- Keep system instructions explicit and role-specific.
- Provide previous messages in the envelope as context; truncate to relevant chunks.
- Request strict JSON outputs for machine-parsable handoffs.

Writer prompt example:
```
Role: Writer Agent.
Goal: Produce 3 LinkedIn post variants from the following brief {brief}.
Output valid JSON: {"variants":[{"text":"...", "tone":"...", "length":200}]}
```

Editor prompt example:
```
Role: Editor Agent.
Input: {variant_text}
Task: Improve clarity and brand voice. Ensure no unverified claims. Return JSON: {"edited":"...", "notes":"..."}
```

## Failures & Retries

- Limit retries per envelope; escalate to human when thresholds are exceeded.
- Keep versioned prompts and model settings with each envelope to reproduce outputs.

## Observability & Metrics

- Track average latency, tokens used per agent, success rate, and human override rate.
- Store per-item metadata: model, temperature, prompt_version, and timestamps.

## Example file/storage schema

- envelopes table: id, campaign_id, role, input_json, output_json, history_json, status, created_at, updated_at

## Testing & Simulation

- Simulate large batches with mocked Claude responses.
- Run A/B tests by routing generated variants to separate audiences and compare performance.

## Next steps

- Define agent role set and acceptance criteria for your particular marketing lifecycle.
- Implement a small pilot pipeline in n8n with monitoring and cost controls.
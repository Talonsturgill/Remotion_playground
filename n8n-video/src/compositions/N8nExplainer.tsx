import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, Audio, staticFile } from 'remotion';
import { theme } from '../theme';
import { WorkflowNode } from '../components/nodes/WorkflowNode';
import { ConnectionLine } from '../components/canvas/ConnectionLine';
import { Caption } from '../components/text/Caption';
import { Title } from '../components/text/Title';
import { Stats } from '../components/text/Stats';
import { PromptHighlight } from '../components/text/PromptHighlight';
import { Logo } from '../components/Logo';

// Frame timings (30fps)
const FRAMES = {
  // Hook: 0-3s (0-90 frames)
  HOOK_START: 0,
  HOOK_END: 90,

  // Problem: 3-8s (90-240 frames)
  PROBLEM_START: 90,
  PROBLEM_END: 240,

  // Stage 1 - Discovery: 8-15s (240-450 frames)
  STAGE1_START: 240,
  STAGE1_END: 450,

  // Stage 2 - Selection: 15-22s (450-660 frames)
  STAGE2_START: 450,
  STAGE2_END: 660,

  // Stage 3 - Writers Room: 22-35s (660-1050 frames)
  STAGE3_START: 660,
  STAGE3_END: 1050,

  // Stage 4 - Quality Gate with Prompts: 35-45s (1050-1350 frames)
  STAGE4_START: 1050,
  STAGE4_END: 1350,

  // Stage 5 - Delivery: 45-52s (1350-1560 frames)
  STAGE5_START: 1350,
  STAGE5_END: 1560,

  // Results + CTA: 52-60s (1560-1800 frames)
  RESULTS_START: 1560,
  RESULTS_END: 1800,
};

export const N8nExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Center coordinates
  const cx = width / 2;
  const cy = height / 2;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #1a1a2e 100%)`,
      }}
    >
      {/* Background music */}
      <Audio
        src={staticFile('no-copyright-music-hip-hop-333685.mp3')}
        volume={0.7}
      />

      {/* Animated background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,160,228,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,160,228,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          transform: `translateY(${(frame * 0.3) % 40}px)`,
        }}
      />

      {/* Logo watermark */}
      <Logo appearAt={0} position="corner" size={40} />

      {/* ========== HOOK SECTION ========== */}
      <Sequence from={FRAMES.HOOK_START} durationInFrames={FRAMES.HOOK_END - FRAMES.HOOK_START}>
        <Title
          text="We automated our Twitter strategy."
          subtitle="Here's how."
          appearAt={0}
        />
      </Sequence>

      {/* ========== PROBLEM SECTION ========== */}
      <Sequence from={FRAMES.PROBLEM_START} durationInFrames={FRAMES.PROBLEM_END - FRAMES.PROBLEM_START}>
        <Caption
          text="Creating quality threads 3x a week?"
          appearAt={0}
          disappearAt={70}
          position="center"
          size="large"
        />
        <Caption
          text="That's hours of work."
          appearAt={75}
          position="center"
          size="large"
          highlight
        />
      </Sequence>

      {/* ========== STAGE 1: DISCOVERY ========== */}
      <Sequence from={FRAMES.STAGE1_START} durationInFrames={FRAMES.STAGE1_END - FRAMES.STAGE1_START}>
        <Caption
          text="STAGE 1: Content Discovery"
          appearAt={0}
          disappearAt={200}
          position="top"
          size="medium"
          highlight
        />

        {/* Schedule trigger */}
        <WorkflowNode
          label="M/W/F 9AM"
          type="trigger"
          icon="schedule"
          x={cx - 300}
          y={cy - 100}
          appearAt={20}
          isActive={frame - FRAMES.STAGE1_START > 30}
        />

        {/* RSS Feeds */}
        {['TechCrunch', 'Wired', 'MIT', 'a16z', 'OhioX'].map((name, i) => (
          <WorkflowNode
            key={name}
            label={name}
            type="integration"
            icon="rss"
            x={cx - 50}
            y={cy - 180 + i * 80}
            appearAt={40 + i * 10}
            isActive={frame - FRAMES.STAGE1_START > 60 + i * 10}
            scale={0.7}
          />
        ))}

        {/* Merge node */}
        <WorkflowNode
          label="Merge"
          type="flow"
          icon="merge"
          x={cx + 200}
          y={cy - 20}
          appearAt={100}
          isActive={frame - FRAMES.STAGE1_START > 120}
        />

        {/* Connections */}
        <ConnectionLine
          fromX={cx - 260}
          fromY={cy - 100}
          toX={cx - 90}
          toY={cy - 20}
          appearAt={50}
          isActive={frame - FRAMES.STAGE1_START > 60}
        />
        <ConnectionLine
          fromX={cx + 30}
          fromY={cy - 20}
          toX={cx + 160}
          toY={cy - 20}
          appearAt={100}
          isActive={frame - FRAMES.STAGE1_START > 120}
        />

        <Caption
          text="5 RSS feeds scan AI news every morning"
          appearAt={130}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== STAGE 2: AI SELECTION ========== */}
      <Sequence from={FRAMES.STAGE2_START} durationInFrames={FRAMES.STAGE2_END - FRAMES.STAGE2_START}>
        <Caption
          text="STAGE 2: AI Topic Selection"
          appearAt={0}
          disappearAt={200}
          position="top"
          size="medium"
          highlight
        />

        {/* Articles coming in */}
        {[0, 1, 2, 3, 4].map((i) => {
          const fadeOut = interpolate(
            frame - FRAMES.STAGE2_START,
            [60 + i * 10, 80 + i * 10],
            [1, i === 2 ? 1 : 0],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: cx - 200 + i * 30,
                top: cy - 100 + i * 20,
                width: 120,
                height: 80,
                background: i === 2 ? theme.colors.primary : theme.colors.backgroundLight,
                borderRadius: 8,
                opacity: fadeOut * (frame - FRAMES.STAGE2_START > 20 + i * 5 ? 1 : 0),
                border: i === 2 ? `3px solid ${theme.colors.primary}` : 'none',
                boxShadow: i === 2 ? `0 0 30px ${theme.colors.primary}60` : 'none',
                transform: `scale(${i === 2 && frame - FRAMES.STAGE2_START > 100 ? 1.2 : 1})`,
                transition: 'transform 0.3s',
              }}
            />
          );
        })}

        {/* Topic Selector Agent */}
        <WorkflowNode
          label="Topic Selector"
          type="ai"
          icon="ai"
          x={cx + 150}
          y={cy}
          appearAt={40}
          isActive={frame - FRAMES.STAGE2_START > 50}
        />

        <Caption
          text="AI picks the ONE article worth talking about"
          appearAt={100}
          disappearAt={140}
          position="bottom"
          size="medium"
        />
        <Caption
          text="Not clickbait. Stories that matter."
          appearAt={145}
          position="bottom"
          size="medium"
          highlight
        />
      </Sequence>

      {/* ========== STAGE 3: WRITERS ROOM ========== */}
      <Sequence from={FRAMES.STAGE3_START} durationInFrames={FRAMES.STAGE3_END - FRAMES.STAGE3_START}>
        <Caption
          text="STAGE 3: The AI Writers Room"
          appearAt={0}
          disappearAt={380}
          position="top"
          size="medium"
          highlight
        />

        {/* Four AI Agents */}
        <WorkflowNode
          label="Outliner"
          type="ai"
          icon="ai"
          x={cx - 250}
          y={cy - 80}
          appearAt={20}
          isActive={frame - FRAMES.STAGE3_START > 40 && frame - FRAMES.STAGE3_START < 150}
        />
        <WorkflowNode
          label="Writer"
          type="ai"
          icon="ai"
          x={cx - 50}
          y={cy - 80}
          appearAt={60}
          isActive={frame - FRAMES.STAGE3_START > 100 && frame - FRAMES.STAGE3_START < 200}
        />
        <WorkflowNode
          label="Critic"
          type="ai"
          icon="ai"
          x={cx + 150}
          y={cy - 80}
          appearAt={100}
          isActive={frame - FRAMES.STAGE3_START > 150 && frame - FRAMES.STAGE3_START < 300}
        />
        <WorkflowNode
          label="Reviser"
          type="ai"
          icon="ai"
          x={cx + 350}
          y={cy - 80}
          appearAt={140}
          isActive={frame - FRAMES.STAGE3_START > 250}
        />

        {/* Connections */}
        <ConnectionLine
          fromX={cx - 210}
          fromY={cy - 80}
          toX={cx - 90}
          toY={cy - 80}
          appearAt={50}
          isActive={frame - FRAMES.STAGE3_START > 80}
        />
        <ConnectionLine
          fromX={cx - 10}
          fromY={cy - 80}
          toX={cx + 110}
          toY={cy - 80}
          appearAt={90}
          isActive={frame - FRAMES.STAGE3_START > 130}
        />
        <ConnectionLine
          fromX={cx + 190}
          fromY={cy - 80}
          toX={cx + 310}
          toY={cy - 80}
          appearAt={130}
          isActive={frame - FRAMES.STAGE3_START > 200}
        />

        <Caption
          text="One outlines. One writes. One critiques. One revises."
          appearAt={180}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== STAGE 4: QUALITY GATE + PROMPTS ========== */}
      <Sequence from={FRAMES.STAGE4_START} durationInFrames={FRAMES.STAGE4_END - FRAMES.STAGE4_START}>
        <Caption
          text="STAGE 4: The Quality Gate"
          appearAt={0}
          disappearAt={60}
          position="top"
          size="medium"
          highlight
        />

        {/* Show the harsh prompt */}
        <PromptHighlight
          text="Be ruthless. Default to REJECT."
          source="Quality Critic Agent Prompt"
          appearAt={30}
          disappearAt={120}
        />

        <PromptHighlight
          text="If you're unsure, it's not good enough."
          source="Quality Critic Agent Prompt"
          appearAt={130}
          disappearAt={220}
        />

        {/* Quality Gate visualization */}
        {frame - FRAMES.STAGE4_START > 220 && (
          <>
            <WorkflowNode
              label="Quality Gate"
              type="flow"
              icon="quality"
              x={cx}
              y={cy - 50}
              appearAt={220}
              isActive
            />

            {/* Score meter */}
            <div
              style={{
                position: 'absolute',
                left: cx - 100,
                top: cy + 80,
                width: 200,
                height: 24,
                background: theme.colors.backgroundLight,
                borderRadius: 12,
                overflow: 'hidden',
                border: `2px solid ${theme.colors.surface}`,
              }}
            >
              <div
                style={{
                  width: `${interpolate(frame - FRAMES.STAGE4_START - 220, [0, 50], [0, 80], { extrapolateRight: 'clamp' })}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${theme.colors.warning}, ${theme.colors.success})`,
                  borderRadius: 10,
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: cx - 100,
                top: cy + 115,
                width: 200,
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 700,
                color: theme.colors.success,
                fontFamily: theme.fonts.primary,
              }}
            >
              Score: 8/10 ✓
            </div>
          </>
        )}

        <Caption
          text="Nothing ships until it scores 8 out of 10"
          appearAt={250}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== STAGE 5: DELIVERY ========== */}
      <Sequence from={FRAMES.STAGE5_START} durationInFrames={FRAMES.STAGE5_END - FRAMES.STAGE5_START}>
        <Caption
          text="STAGE 5: Human in the Loop"
          appearAt={0}
          disappearAt={80}
          position="top"
          size="medium"
          highlight
        />

        {/* Content HQ (Notion) */}
        <WorkflowNode
          label="Content HQ"
          type="integration"
          icon="notion"
          x={cx - 150}
          y={cy - 50}
          appearAt={20}
          isActive={frame - FRAMES.STAGE5_START > 30 && frame - FRAMES.STAGE5_START < 120}
        />

        {/* Human Approval */}
        <WorkflowNode
          label="Approve"
          type="action"
          icon="quality"
          x={cx}
          y={cy - 50}
          appearAt={50}
          isActive={frame - FRAMES.STAGE5_START > 60 && frame - FRAMES.STAGE5_START < 140}
        />

        {/* Slack notification */}
        <WorkflowNode
          label="Slack"
          type="integration"
          icon="slack"
          x={cx + 150}
          y={cy - 50}
          appearAt={80}
          isActive={frame - FRAMES.STAGE5_START > 100}
        />

        <ConnectionLine
          fromX={cx - 110}
          fromY={cy - 50}
          toX={cx - 40}
          toY={cy - 50}
          appearAt={40}
          isActive={frame - FRAMES.STAGE5_START > 50}
        />
        <ConnectionLine
          fromX={cx + 40}
          fromY={cy - 50}
          toX={cx + 110}
          toY={cy - 50}
          appearAt={70}
          isActive={frame - FRAMES.STAGE5_START > 90}
        />

        <Caption
          text="Thread lands in Content HQ"
          appearAt={30}
          disappearAt={90}
          position="bottom"
          size="medium"
        />
        <Caption
          text="One-click human approval"
          appearAt={95}
          disappearAt={155}
          position="bottom"
          size="medium"
          highlight
        />
        <Caption
          text="Then Slack pings the team"
          appearAt={160}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== RESULTS + CTA ========== */}
      <Sequence from={FRAMES.RESULTS_START} durationInFrames={FRAMES.RESULTS_END - FRAMES.RESULTS_START}>
        <Stats
          stats={[
            { value: '3x', label: 'per week' },
            { value: '8+', label: 'quality score' },
            { value: '100%', label: 'automated' },
          ]}
          appearAt={0}
        />

        <Caption
          text="Zero writer's block. Just results."
          appearAt={80}
          disappearAt={160}
          position="bottom"
          size="large"
          highlight
        />

        {/* Final logo - positioned at bottom */}
        <Logo appearAt={120} position="bottom" size={50} />
      </Sequence>
    </AbsoluteFill>
  );
};

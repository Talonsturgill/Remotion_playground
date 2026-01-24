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
import { AgentWorkScreen } from '../components/agents/AgentWorkScreen';
import { ScreenshotDisplay } from '../components/agents/ScreenshotDisplay';

// Frame timings (30fps) - 60 second video
const FRAMES = {
  // Hook: 0-3s (0-90 frames)
  HOOK_START: 0,
  HOOK_END: 90,

  // Problem: 3-7s (90-210 frames)
  PROBLEM_START: 90,
  PROBLEM_END: 210,

  // Stage 1 - Discovery: 7-14s (210-420 frames)
  STAGE1_START: 210,
  STAGE1_END: 420,

  // Stage 2 - Selection: 14-23s (420-690 frames) - extended for readability
  STAGE2_START: 420,
  STAGE2_END: 690,

  // Stage 3 - Writers Room: 23-36.5s (690-1095 frames) - extended for agent flow view
  STAGE3_START: 690,
  STAGE3_END: 1095,

  // Stage 4 - Quality Gate: 36.5-45.5s (1095-1365 frames)
  STAGE4_START: 1095,
  STAGE4_END: 1365,

  // Stage 5 - Delivery: 45.5-53.5s (1365-1605 frames)
  STAGE5_START: 1365,
  STAGE5_END: 1605,

  // Results + CTA: 53.5-64.5s (1605-1935 frames)
  RESULTS_START: 1605,
  RESULTS_END: 1935,
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
        background: `linear-gradient(145deg, #0a0a12 0%, #0F172A 50%, #1a1a2e 100%)`,
      }}
    >
      {/* Background music */}
      <Audio
        src={staticFile('no-copyright-music-hip-hop-333685.mp3')}
        volume={0.6}
      />

      {/* Animated background grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,160,228,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,160,228,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translateY(${(frame * 0.5) % 50}px)`,
        }}
      />

      {/* Glowing accent in background */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${theme.colors.primary}15 0%, transparent 70%)`,
          transform: 'translateX(-50%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Logo watermark - top right */}
      <Logo appearAt={0} position="corner" size={35} />

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
          disappearAt={60}
          position="center"
          size="large"
        />
        <Caption
          text="That's hours of work."
          appearAt={65}
          position="center"
          size="xlarge"
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

        {/* Schedule trigger - centered at top */}
        <WorkflowNode
          label="M/W/F 9AM"
          type="trigger"
          icon="schedule"
          x={cx}
          y={cy - 250}
          appearAt={15}
          isActive={frame - FRAMES.STAGE1_START > 25}
        />

        {/* RSS Feeds - spread out horizontally, pushed down from trigger */}
        {[
          { name: 'TechCrunch', x: cx - 280, y: cy - 20 },
          { name: 'Wired', x: cx - 140, y: cy + 120 },
          { name: 'MIT Tech', x: cx, y: cy - 20 },
          { name: 'a16z', x: cx + 140, y: cy + 120 },
          { name: 'OhioX', x: cx + 280, y: cy - 20 },
        ].map((feed, i) => (
          <WorkflowNode
            key={feed.name}
            label={feed.name}
            type="integration"
            icon="rss"
            x={feed.x}
            y={feed.y}
            appearAt={30 + i * 8}
            isActive={frame - FRAMES.STAGE1_START > 50 + i * 8}
            scale={1}
          />
        ))}

        {/* Merge node - centered below the feeds */}
        <WorkflowNode
          label="Merge"
          type="flow"
          icon="merge"
          x={cx}
          y={cy + 260}
          appearAt={80}
          isActive={frame - FRAMES.STAGE1_START > 100}
        />

        {/* Connections from trigger to each RSS feed */}
        <ConnectionLine fromX={cx} fromY={cy - 210} toX={cx - 280} toY={cy - 60} appearAt={25} isActive={frame - FRAMES.STAGE1_START > 35} />
        <ConnectionLine fromX={cx} fromY={cy - 210} toX={cx - 140} toY={cy + 80} appearAt={33} isActive={frame - FRAMES.STAGE1_START > 43} />
        <ConnectionLine fromX={cx} fromY={cy - 210} toX={cx} toY={cy - 60} appearAt={41} isActive={frame - FRAMES.STAGE1_START > 51} />
        <ConnectionLine fromX={cx} fromY={cy - 210} toX={cx + 140} toY={cy + 80} appearAt={49} isActive={frame - FRAMES.STAGE1_START > 59} />
        <ConnectionLine fromX={cx} fromY={cy - 210} toX={cx + 280} toY={cy - 60} appearAt={57} isActive={frame - FRAMES.STAGE1_START > 67} />

        {/* Connections from each RSS feed to merge node */}
        <ConnectionLine fromX={cx - 280} fromY={cy + 20} toX={cx} toY={cy + 220} appearAt={70} isActive={frame - FRAMES.STAGE1_START > 85} />
        <ConnectionLine fromX={cx - 140} fromY={cy + 160} toX={cx} toY={cy + 220} appearAt={75} isActive={frame - FRAMES.STAGE1_START > 90} />
        <ConnectionLine fromX={cx} fromY={cy + 20} toX={cx} toY={cy + 220} appearAt={80} isActive={frame - FRAMES.STAGE1_START > 95} />
        <ConnectionLine fromX={cx + 140} fromY={cy + 160} toX={cx} toY={cy + 220} appearAt={85} isActive={frame - FRAMES.STAGE1_START > 100} />
        <ConnectionLine fromX={cx + 280} fromY={cy + 20} toX={cx} toY={cy + 220} appearAt={90} isActive={frame - FRAMES.STAGE1_START > 105} />

        <Caption
          text="5 RSS feeds scan AI news"
          appearAt={110}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== STAGE 2: AI SELECTION ========== */}
      <Sequence from={FRAMES.STAGE2_START} durationInFrames={FRAMES.STAGE2_END - FRAMES.STAGE2_START}>
        <Caption
          text="STAGE 2: AI Topic Selection"
          appearAt={0}
          disappearAt={70}
          position="top"
          size="medium"
          highlight
        />

        {/* AI Agent Thinking - show the logic */}
        <PromptHighlight
          text="What does Transform Labs' audience care about?"
          source="Topic Selector Agent — Thinking..."
          appearAt={20}
          disappearAt={110}
        />

        <PromptHighlight
          text="What's NOT just hype?"
          source="Topic Selector Agent — Filtering..."
          appearAt={115}
          disappearAt={195}
        />

        {/* Articles coming in and being filtered - positioned below the text */}
        {[0, 1, 2, 3, 4].map((i) => {
          const fadeOut = interpolate(
            frame - FRAMES.STAGE2_START,
            [170 + i * 8, 195 + i * 8],
            [1, i === 2 ? 1 : 0],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
          );
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: cx - 180 + i * 80,
                top: cy + 120 + (i % 2) * 30,
                width: 100,
                height: 65,
                background: i === 2 ? theme.colors.primary : theme.colors.backgroundLight,
                borderRadius: 8,
                opacity: fadeOut * (frame - FRAMES.STAGE2_START > 150 + i * 5 ? 1 : 0),
                border: i === 2 ? `3px solid ${theme.colors.primary}` : 'none',
                boxShadow: i === 2 ? `0 0 40px ${theme.colors.primary}80` : 'none',
                transform: `scale(${i === 2 && frame - FRAMES.STAGE2_START > 210 ? 1.3 : 1})`,
              }}
            />
          );
        })}

        {/* Topic Selector Agent */}
        <WorkflowNode
          label="Topic Selector"
          type="ai"
          icon="ai"
          x={cx + 130}
          y={cy}
          appearAt={200}
          isActive={frame - FRAMES.STAGE2_START > 210}
        />

        {/* Flow line: articles to Topic Selector */}
        <ConnectionLine
          fromX={cx - 80}
          fromY={cy - 20}
          toX={cx + 90}
          toY={cy}
          appearAt={150}
          isActive={frame - FRAMES.STAGE2_START > 160}
        />

        <Caption
          text="One article selected."
          appearAt={220}
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
          disappearAt={60}
          position="top"
          size="medium"
          highlight
        />

        {/* Show workflow nodes - sequential activation left to right (extended view time) */}
        {frame - FRAMES.STAGE3_START < 125 && (
          <>
            {/* Outliner - appears first, lights up immediately */}
            <WorkflowNode
              label="Outliner"
              type="ai"
              icon="ai"
              x={cx - 280}
              y={cy - 60}
              appearAt={15}
              isActive={frame - FRAMES.STAGE3_START > 18}
            />

            {/* Line to Writer - draws after Outliner lights */}
            <ConnectionLine fromX={cx - 240} fromY={cy - 60} toX={cx - 120} toY={cy - 60} appearAt={22} isActive={frame - FRAMES.STAGE3_START > 32} />

            {/* Writer - appears and lights up after line reaches it */}
            <WorkflowNode
              label="Writer"
              type="ai"
              icon="ai"
              x={cx - 80}
              y={cy - 60}
              appearAt={25}
              isActive={frame - FRAMES.STAGE3_START > 35}
            />

            {/* Line to Critic - draws after Writer lights */}
            <ConnectionLine fromX={cx - 40} fromY={cy - 60} toX={cx + 80} toY={cy - 60} appearAt={38} isActive={frame - FRAMES.STAGE3_START > 48} />

            {/* Critic - appears and lights up after line reaches it */}
            <WorkflowNode
              label="Critic"
              type="ai"
              icon="ai"
              x={cx + 120}
              y={cy - 60}
              appearAt={40}
              isActive={frame - FRAMES.STAGE3_START > 50}
            />

            {/* Line to Reviser - draws after Critic lights */}
            <ConnectionLine fromX={cx + 160} fromY={cy - 60} toX={cx + 280} toY={cy - 60} appearAt={53} isActive={frame - FRAMES.STAGE3_START > 63} />

            {/* Reviser - appears and lights up after line reaches it */}
            <WorkflowNode
              label="Reviser"
              type="ai"
              icon="ai"
              x={cx + 320}
              y={cy - 60}
              appearAt={55}
              isActive={frame - FRAMES.STAGE3_START > 65}
            />
          </>
        )}

        <Caption
          text="4 AI agents work together..."
          appearAt={30}
          disappearAt={120}
          position="bottom"
          size="medium"
        />

        {/* ZOOM IN: Watch Outliner work */}
        <AgentWorkScreen
          type="outliner"
          appearAt={125}
          disappearAt={215}
        />
        <Caption
          text="Outliner structures the thread"
          appearAt={130}
          disappearAt={210}
          position="top"
          size="medium"
        />

        {/* ZOOM IN: Watch Writer work */}
        <AgentWorkScreen
          type="writer"
          appearAt={220}
          disappearAt={310}
        />
        <Caption
          text="Writer drafts each tweet"
          appearAt={225}
          disappearAt={305}
          position="top"
          size="medium"
        />

        {/* ZOOM IN: Watch Critic work */}
        <AgentWorkScreen
          type="critic"
          appearAt={315}
          disappearAt={385}
        />
        <Caption
          text="Critic scores ruthlessly"
          appearAt={320}
          disappearAt={380}
          position="top"
          size="medium"
          highlight
        />
      </Sequence>

      {/* ========== STAGE 4: QUALITY GATE + PROMPTS ========== */}
      <Sequence from={FRAMES.STAGE4_START} durationInFrames={FRAMES.STAGE4_END - FRAMES.STAGE4_START}>
        <Caption
          text="STAGE 4: The Quality Gate"
          appearAt={0}
          disappearAt={50}
          position="top"
          size="medium"
          highlight
        />

        {/* Show the harsh prompt */}
        <PromptHighlight
          text="Be ruthless. Default to REJECT."
          source="Quality Critic Agent Prompt"
          appearAt={25}
          disappearAt={110}
        />

        <PromptHighlight
          text="If you're unsure, it's not good enough."
          source="Quality Critic Agent Prompt"
          appearAt={115}
          disappearAt={200}
        />

        {/* Quality Gate visualization */}
        {frame - FRAMES.STAGE4_START > 200 && (
          <>
            <WorkflowNode
              label="Quality Gate"
              type="flow"
              icon="quality"
              x={cx}
              y={cy - 50}
              appearAt={200}
              isActive
            />

            {/* Flow line into Quality Gate */}
            <ConnectionLine
              fromX={cx - 200}
              fromY={cy - 150}
              toX={cx - 40}
              toY={cy - 50}
              appearAt={200}
              isActive={frame - FRAMES.STAGE4_START > 210}
            />

            {/* Flow line out of Quality Gate */}
            <ConnectionLine
              fromX={cx + 40}
              fromY={cy - 50}
              toX={cx + 200}
              toY={cy + 50}
              appearAt={220}
              isActive={frame - FRAMES.STAGE4_START > 230}
            />

            {/* Score meter */}
            <div
              style={{
                position: 'absolute',
                left: cx - 120,
                top: cy + 70,
                width: 240,
                height: 28,
                background: theme.colors.backgroundLight,
                borderRadius: 14,
                overflow: 'hidden',
                border: `2px solid ${theme.colors.surface}`,
              }}
            >
              <div
                style={{
                  width: `${interpolate(frame - FRAMES.STAGE4_START - 200, [0, 40], [0, 80], { extrapolateRight: 'clamp' })}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${theme.colors.warning}, ${theme.colors.success})`,
                  borderRadius: 12,
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: cx - 120,
                top: cy + 108,
                width: 240,
                textAlign: 'center',
                fontSize: 28,
                fontWeight: 800,
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
          appearAt={230}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== STAGE 5: DELIVERY ========== */}
      <Sequence from={FRAMES.STAGE5_START} durationInFrames={FRAMES.STAGE5_END - FRAMES.STAGE5_START}>
        <Caption
          text="STAGE 5: Human in the Loop"
          appearAt={0}
          disappearAt={50}
          position="top"
          size="medium"
          highlight
        />

        {/* Show real Notion screenshot - Content HQ */}
        <ScreenshotDisplay
          src="slack_pic2.png"
          title="Content HQ — Thread Ready for Review"
          appearAt={20}
          disappearAt={120}
          scale={0.95}
        />

        <Caption
          text="Thread lands in Content HQ"
          appearAt={25}
          disappearAt={65}
          position="bottom"
          size="medium"
        />
        <Caption
          text="One-click human approval"
          appearAt={70}
          disappearAt={120}
          position="bottom"
          size="medium"
          highlight
        />

        {/* Show real Slack notification */}
        <ScreenshotDisplay
          src="slack_pic.png"
          title="Slack — #marketing-twitter-posts"
          appearAt={125}
          scale={0.95}
        />

        <Caption
          text="Slack pings the team — Thread posted!"
          appearAt={135}
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
          appearAt={60}
          disappearAt={95}
          position="bottom"
          size="large"
          highlight
        />

        {/* Final logo - positioned at bottom, not covering stats */}
        <Logo appearAt={100} position="bottom" size={50} />
      </Sequence>
    </AbsoluteFill>
  );
};

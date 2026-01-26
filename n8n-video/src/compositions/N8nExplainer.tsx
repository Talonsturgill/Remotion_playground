import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile, Img } from 'remotion';
import { theme } from '../theme';
import { WorkflowNode } from '../components/nodes/WorkflowNode';
import { ConnectionLine } from '../components/canvas/ConnectionLine';
import { Caption } from '../components/text/Caption';
import { Title } from '../components/text/Title';
import { Stats } from '../components/text/Stats';
import { Logo } from '../components/Logo';

// Frame timings (30fps) - 65 second video = 1950 frames
const FRAMES = {
  // Hook: 0-3s (0-90 frames)
  HOOK_START: 0,
  HOOK_END: 90,

  // Problem: 3-7s (90-210 frames)
  PROBLEM_START: 90,
  PROBLEM_END: 210,

  // Stage 1 - Trigger: 7-13s (210-390 frames)
  STAGE1_START: 210,
  STAGE1_END: 390,

  // Stage 2 - RSS Collection: 13-24s (390-720 frames)
  STAGE2_START: 390,
  STAGE2_END: 720,

  // Stage 3 - AI Processing: 24-40s (720-1200 frames)
  STAGE3_START: 720,
  STAGE3_END: 1200,

  // Stage 4 - Output: 40-52s (1200-1560 frames)
  STAGE4_START: 1200,
  STAGE4_END: 1560,

  // Results + CTA: 52-65s (1560-1950 frames)
  RESULTS_START: 1560,
  RESULTS_END: 1950,
};

// Cinematic floating particle component
const FloatingParticle: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
  speed?: number;
}> = ({ x, y, size, delay, color, speed = 1 }) => {
  const frame = useCurrentFrame();
  const animFrame = Math.max(0, frame - delay);

  const float = Math.sin(animFrame * 0.05 * speed) * 20;
  const pulse = 0.5 + Math.sin(animFrame * 0.08) * 0.5;
  const opacity = interpolate(animFrame, [0, 30], [0, 0.6], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + float,
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        opacity: opacity * pulse,
        filter: `blur(${size / 4}px)`,
        boxShadow: `0 0 ${size * 2}px ${color}`,
      }}
    />
  );
};

// Data stream line component
const DataStream: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  appearAt: number;
  color?: string;
  particleCount?: number;
}> = ({ fromX, fromY, toX, toY, appearAt, color = theme.colors.primary, particleCount = 5 }) => {
  const frame = useCurrentFrame();
  const localFrame = frame - appearAt;

  if (localFrame < 0) return null;

  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const progress = ((localFrame * 2 + i * 20) % 100) / 100;
    const x = fromX + (toX - fromX) * progress;
    const y = fromY + (toY - fromY) * progress;
    const opacity = Math.sin(progress * Math.PI) * 0.8;

    particles.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x - 4,
          top: y - 4,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          opacity,
          boxShadow: `0 0 12px ${color}, 0 0 24px ${color}50`,
        }}
      />
    );
  }

  return <>{particles}</>;
};

// Glowing text component for dramatic reveals
const GlowText: React.FC<{
  text: string;
  appearAt: number;
  size?: number;
  color?: string;
  y?: number;
}> = ({ text, appearAt, size = 72, color = theme.colors.textPrimary, y = 50 }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const localFrame = frame - appearAt;

  if (localFrame < 0) return null;

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.8 },
  });

  const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const glowIntensity = 0.5 + Math.sin(localFrame * 0.1) * 0.3;

  return (
    <div
      style={{
        position: 'absolute',
        top: `${y}%`,
        left: 0,
        right: 0,
        textAlign: 'center',
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          fontSize: size,
          fontWeight: 800,
          fontFamily: theme.fonts.primary,
          color,
          textShadow: `0 0 ${40 * glowIntensity}px ${theme.colors.primary}, 0 0 ${80 * glowIntensity}px ${theme.colors.primary}50`,
          letterSpacing: '-2px',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// RSS Feed card component
const RSSCard: React.FC<{
  name: string;
  icon: string;
  x: number;
  y: number;
  appearAt: number;
  isActive?: boolean;
}> = ({ name, icon, x, y, appearAt, isActive = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - appearAt;

  if (localFrame < 0) return null;

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.6 },
  });

  const glow = isActive ? 0.6 + Math.sin(localFrame * 0.15) * 0.4 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 70,
        top: y - 35,
        width: 140,
        height: 70,
        background: isActive
          ? `linear-gradient(135deg, ${theme.colors.primary}30, ${theme.colors.surface})`
          : theme.colors.surface,
        borderRadius: 12,
        transform: `scale(${scale})`,
        border: isActive ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.backgroundLight}`,
        boxShadow: isActive
          ? `0 0 ${30 * glow}px ${theme.colors.primary}60, 0 8px 32px rgba(0,0,0,0.4)`
          : '0 4px 16px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
      }}
    >
      <div style={{ fontSize: 20 }}>{icon}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          fontFamily: theme.fonts.primary,
          color: theme.colors.textPrimary,
          textAlign: 'center',
          padding: '0 8px',
        }}
      >
        {name}
      </div>
    </div>
  );
};

// Article preview card
const ArticleCard: React.FC<{
  x: number;
  y: number;
  appearAt: number;
  fadeOutAt?: number;
  highlight?: boolean;
}> = ({ x, y, appearAt, fadeOutAt, highlight = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - appearAt;

  if (localFrame < 0) return null;

  const scale = spring({
    frame: localFrame,
    fps,
    config: { damping: 18, stiffness: 150, mass: 0.5 },
  });

  let opacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  if (fadeOutAt && frame > fadeOutAt) {
    opacity = interpolate(frame - fadeOutAt, [0, 20], [1, 0], { extrapolateRight: 'clamp' });
  }

  const glow = highlight ? 0.7 + Math.sin(localFrame * 0.12) * 0.3 : 0;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - 40,
        top: y - 25,
        width: 80,
        height: 50,
        background: highlight
          ? `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primary}80)`
          : theme.colors.backgroundLight,
        borderRadius: 8,
        transform: `scale(${scale})`,
        opacity,
        border: highlight ? `2px solid ${theme.colors.primary}` : 'none',
        boxShadow: highlight ? `0 0 ${25 * glow}px ${theme.colors.primary}` : '0 2px 8px rgba(0,0,0,0.2)',
      }}
    >
      {/* Fake text lines */}
      <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 3, width: '90%' }} />
        <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, width: '70%' }} />
        <div style={{ height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, width: '50%' }} />
      </div>
    </div>
  );
};

// Blog topic result card
const TopicCard: React.FC<{
  topic: string;
  audience: string;
  x: number;
  y: number;
  appearAt: number;
  index: number;
}> = ({ topic, audience, x, y, appearAt, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - appearAt;

  if (localFrame < 0) return null;

  const slideIn = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.7 },
  });

  const opacity = interpolate(localFrame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 420,
        background: `linear-gradient(135deg, ${theme.colors.surface}, ${theme.colors.backgroundLight})`,
        borderRadius: 16,
        padding: 20,
        transform: `translateX(${(1 - slideIn) * 100}px)`,
        opacity,
        borderLeft: `4px solid ${theme.colors.primary}`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: theme.colors.primary,
          marginBottom: 8,
          fontFamily: theme.fonts.primary,
        }}
      >
        {index}. BLOG TOPIC
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: theme.colors.textPrimary,
          marginBottom: 12,
          fontFamily: theme.fonts.primary,
          lineHeight: 1.3,
        }}
      >
        {topic}
      </div>
      <div
        style={{
          fontSize: 13,
          color: theme.colors.textMuted,
          fontFamily: theme.fonts.primary,
        }}
      >
        👥 {audience}
      </div>
    </div>
  );
};

export const N8nExplainer: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();

  // Center coordinates
  const cx = width / 2;
  const cy = height / 2;

  // Parallax background movement
  const bgParallax = frame * 0.3;
  const bgParallax2 = frame * 0.15;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, #050510 0%, #0a1628 40%, #0F172A 70%, #1a0a20 100%)`,
        overflow: 'hidden',
      }}
    >
      {/* Background music */}
      <Audio
        src={staticFile('no-copyright-music-hip-hop-333685.mp3')}
        volume={0.55}
      />

      {/* Deep parallax layer - slow moving stars */}
      <div
        style={{
          position: 'absolute',
          inset: -100,
          background: `radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 100%),
                       radial-gradient(2px 2px at 40% 70%, rgba(255,255,255,0.2) 0%, transparent 100%),
                       radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.3) 0%, transparent 100%),
                       radial-gradient(2px 2px at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 100%),
                       radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.4) 0%, transparent 100%),
                       radial-gradient(2px 2px at 90% 90%, rgba(255,255,255,0.2) 0%, transparent 100%)`,
          backgroundSize: '400px 400px',
          transform: `translate(${bgParallax2}px, ${bgParallax2 * 0.5}px)`,
        }}
      />

      {/* Animated grid - medium parallax */}
      <div
        style={{
          position: 'absolute',
          inset: -50,
          backgroundImage: `
            linear-gradient(rgba(0,160,228,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,160,228,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          transform: `translate(${bgParallax % 80}px, ${(bgParallax * 0.7) % 80}px)`,
        }}
      />

      {/* Primary glow orb - follows stages */}
      <div
        style={{
          position: 'absolute',
          top: frame < FRAMES.STAGE2_START ? '30%' : frame < FRAMES.STAGE3_START ? '20%' : '40%',
          left: '50%',
          width: 800,
          height: 800,
          background: `radial-gradient(circle, ${theme.colors.primary}18 0%, ${theme.colors.primary}08 30%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(40px)',
          transition: 'top 1s ease-out',
        }}
      />

      {/* Secondary accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '70%',
          left: '20%',
          width: 400,
          height: 400,
          background: `radial-gradient(circle, #ff006620 0%, transparent 70%)`,
          filter: 'blur(60px)',
          opacity: 0.5 + Math.sin(frame * 0.02) * 0.3,
        }}
      />

      {/* Floating particles throughout */}
      <FloatingParticle x={100} y={200} size={30} delay={0} color={theme.colors.primary} speed={0.8} />
      <FloatingParticle x={900} y={150} size={20} delay={30} color={theme.colors.primary} speed={1.2} />
      <FloatingParticle x={200} y={700} size={25} delay={60} color="#ff0066" speed={0.6} />
      <FloatingParticle x={850} y={600} size={35} delay={90} color={theme.colors.primary} speed={1} />
      <FloatingParticle x={500} y={900} size={20} delay={45} color={theme.colors.success} speed={0.9} />

      {/* Logo watermark - top right */}
      <Logo appearAt={0} position="corner" size={35} />

      {/* ========== HOOK SECTION ========== */}
      <Sequence from={FRAMES.HOOK_START} durationInFrames={FRAMES.HOOK_END - FRAMES.HOOK_START}>
        <GlowText
          text="12 blog ideas."
          appearAt={0}
          size={82}
          y={38}
        />
        <GlowText
          text="Zero research."
          appearAt={25}
          size={82}
          color={theme.colors.primary}
          y={52}
        />
        <Caption
          text="Every Monday. Automated."
          appearAt={55}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== PROBLEM SECTION ========== */}
      <Sequence from={FRAMES.PROBLEM_START} durationInFrames={FRAMES.PROBLEM_END - FRAMES.PROBLEM_START}>
        <Caption
          text="Content teams spend 5+ hours weekly"
          appearAt={0}
          disappearAt={55}
          position="center"
          size="large"
        />
        <Caption
          text="researching what to write about."
          appearAt={15}
          disappearAt={55}
          position="bottom"
          size="medium"
        />

        {/* Visual: scattered articles representing chaos */}
        {[...Array(8)].map((_, i) => (
          <ArticleCard
            key={i}
            x={150 + (i % 4) * 200 + Math.sin(i) * 30}
            y={350 + Math.floor(i / 4) * 120 + Math.cos(i) * 20}
            appearAt={60 + i * 5}
            fadeOutAt={110}
          />
        ))}

        <Caption
          text="What if AI did the research for you?"
          appearAt={65}
          position="center"
          size="xlarge"
          highlight
        />
      </Sequence>

      {/* ========== STAGE 1: TRIGGER ========== */}
      <Sequence from={FRAMES.STAGE1_START} durationInFrames={FRAMES.STAGE1_END - FRAMES.STAGE1_START}>
        <Caption
          text="STAGE 1: The Trigger"
          appearAt={0}
          disappearAt={60}
          position="top"
          size="medium"
          highlight
        />

        {/* Large clock visualization */}
        <div
          style={{
            position: 'absolute',
            left: cx - 120,
            top: cy - 180,
            width: 240,
            height: 240,
            borderRadius: '50%',
            border: `4px solid ${theme.colors.primary}40`,
            background: `radial-gradient(circle, ${theme.colors.surface} 0%, ${theme.colors.background} 100%)`,
            boxShadow: `0 0 60px ${theme.colors.primary}30, inset 0 0 40px rgba(0,0,0,0.5)`,
            opacity: interpolate(frame - FRAMES.STAGE1_START, [0, 30], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          {/* Clock hands */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 4,
              height: 70,
              background: theme.colors.textPrimary,
              borderRadius: 2,
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${(frame - FRAMES.STAGE1_START) * 3}deg)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 6,
              height: 50,
              background: theme.colors.primary,
              borderRadius: 3,
              transformOrigin: 'bottom center',
              transform: `translate(-50%, -100%) rotate(${(frame - FRAMES.STAGE1_START) * 0.5 + 180}deg)`,
            }}
          />
          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 16,
              height: 16,
              background: theme.colors.primary,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 20px ${theme.colors.primary}`,
            }}
          />
        </div>

        {/* Schedule trigger node */}
        <WorkflowNode
          label="Monday 8:30 AM"
          type="trigger"
          icon="schedule"
          x={cx}
          y={cy + 140}
          appearAt={50}
          isActive={frame - FRAMES.STAGE1_START > 70}
        />

        <Caption
          text="Every Monday morning at 8:30 AM"
          appearAt={80}
          disappearAt={150}
          position="bottom"
          size="medium"
        />

        <Caption
          text="The workflow springs to life."
          appearAt={110}
          position="bottom"
          size="large"
          highlight
        />
      </Sequence>

      {/* ========== STAGE 2: RSS COLLECTION ========== */}
      <Sequence from={FRAMES.STAGE2_START} durationInFrames={FRAMES.STAGE2_END - FRAMES.STAGE2_START}>
        <Caption
          text="STAGE 2: Intelligence Gathering"
          appearAt={0}
          disappearAt={80}
          position="top"
          size="medium"
          highlight
        />

        {/* RSS Feed sources - arranged in arc */}
        {[
          { name: 'Dev.to AI', icon: '💻', x: cx - 320, y: cy - 100 },
          { name: 'Dev.to Prod', icon: '⚡', x: cx - 180, y: cy - 200 },
          { name: 'Hacker News', icon: '🔥', x: cx, y: cy - 240 },
          { name: 'Google Dev', icon: '🔧', x: cx + 180, y: cy - 200 },
          { name: 'GitHub Blog', icon: '🐙', x: cx + 320, y: cy - 100 },
          { name: 'InfoQ AI/ML', icon: '🧠', x: cx, y: cy - 50 },
        ].map((feed, i) => (
          <React.Fragment key={feed.name}>
            <RSSCard
              name={feed.name}
              icon={feed.icon}
              x={feed.x}
              y={feed.y}
              appearAt={20 + i * 15}
              isActive={frame - FRAMES.STAGE2_START > 100 + i * 10}
            />
            {/* Data streams flowing to center */}
            <DataStream
              fromX={feed.x}
              fromY={feed.y + 35}
              toX={cx}
              toY={cy + 150}
              appearAt={100 + i * 10}
              particleCount={3}
            />
          </React.Fragment>
        ))}

        {/* Merge/Collection node */}
        <WorkflowNode
          label="Collect & Merge"
          type="flow"
          icon="merge"
          x={cx}
          y={cy + 180}
          appearAt={120}
          isActive={frame - FRAMES.STAGE2_START > 150}
        />

        <Caption
          text="6 curated RSS feeds"
          appearAt={130}
          disappearAt={200}
          position="bottom"
          size="medium"
        />

        {/* Article stream visualization */}
        {frame - FRAMES.STAGE2_START > 180 && (
          <>
            {[...Array(12)].map((_, i) => (
              <ArticleCard
                key={i}
                x={200 + (i % 4) * 180}
                y={cy + 300 + Math.floor(i / 4) * 70}
                appearAt={180 + i * 8}
              />
            ))}
          </>
        )}

        <Caption
          text="50+ articles from the past 7 days"
          appearAt={220}
          disappearAt={280}
          position="bottom"
          size="large"
          highlight
        />

        <Caption
          text="Filtered. Deduplicated. Ready for AI."
          appearAt={260}
          position="bottom"
          size="medium"
        />
      </Sequence>

      {/* ========== STAGE 3: AI PROCESSING ========== */}
      <Sequence from={FRAMES.STAGE3_START} durationInFrames={FRAMES.STAGE3_END - FRAMES.STAGE3_START}>
        <Caption
          text="STAGE 3: AI Analysis"
          appearAt={0}
          disappearAt={80}
          position="top"
          size="medium"
          highlight
        />

        {/* Filter node */}
        <WorkflowNode
          label="Filter & Dedupe"
          type="flow"
          icon="quality"
          x={cx - 280}
          y={cy - 100}
          appearAt={20}
          isActive={frame - FRAMES.STAGE3_START > 50}
        />

        <ConnectionLine
          fromX={cx - 240}
          fromY={cy - 100}
          toX={cx - 40}
          toY={cy - 100}
          appearAt={60}
          isActive={frame - FRAMES.STAGE3_START > 90}
        />

        {/* AI Agent - Large central node */}
        <WorkflowNode
          label="Gemini AI"
          type="ai"
          icon="ai"
          x={cx}
          y={cy - 100}
          appearAt={80}
          isActive={frame - FRAMES.STAGE3_START > 110}
          scale={1.3}
        />

        {/* AI thinking visualization */}
        {frame - FRAMES.STAGE3_START > 120 && frame - FRAMES.STAGE3_START < 300 && (
          <div
            style={{
              position: 'absolute',
              left: cx - 200,
              top: cy + 50,
              width: 400,
              padding: 24,
              background: `linear-gradient(135deg, ${theme.colors.surface}ee, ${theme.colors.backgroundLight}ee)`,
              borderRadius: 16,
              border: `1px solid ${theme.colors.primary}40`,
              boxShadow: `0 0 40px ${theme.colors.primary}20`,
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: theme.colors.primary,
                marginBottom: 12,
                fontFamily: theme.fonts.primary,
              }}
            >
              🤖 AI ANALYZING...
            </div>
            <div
              style={{
                fontSize: 16,
                color: theme.colors.textPrimary,
                fontFamily: theme.fonts.primary,
                lineHeight: 1.6,
                fontStyle: 'italic',
              }}
            >
              {frame - FRAMES.STAGE3_START < 180
                ? '"What does Transform Labs\' audience care about?"'
                : frame - FRAMES.STAGE3_START < 240
                ? '"What topics will drive engagement on LinkedIn?"'
                : '"Generating 12-15 actionable blog ideas..."'}
            </div>
          </div>
        )}

        <Caption
          text="AI scans headlines and descriptions"
          appearAt={130}
          disappearAt={200}
          position="bottom"
          size="medium"
        />

        <Caption
          text="Identifies trends. Spots opportunities."
          appearAt={180}
          disappearAt={260}
          position="bottom"
          size="medium"
        />

        {/* Output parser */}
        <ConnectionLine
          fromX={cx + 40}
          fromY={cy - 100}
          toX={cx + 240}
          toY={cy - 100}
          appearAt={280}
          isActive={frame - FRAMES.STAGE3_START > 310}
        />

        <WorkflowNode
          label="Parse Topics"
          type="flow"
          icon="code"
          x={cx + 280}
          y={cy - 100}
          appearAt={300}
          isActive={frame - FRAMES.STAGE3_START > 330}
        />

        {/* Topic cards appearing */}
        {frame - FRAMES.STAGE3_START > 350 && (
          <>
            <TopicCard
              topic="How AI-Powered Code Review Tools Are Reducing Developer Burnout"
              audience="Engineering managers scaling teams"
              x={cx - 210}
              y={cy + 100}
              appearAt={350}
              index={1}
            />
            {frame - FRAMES.STAGE3_START > 400 && (
              <TopicCard
                topic="The Hidden Costs of LLM APIs: A CFO's Guide to AI Budgeting"
                audience="CFOs implementing enterprise AI"
                x={cx - 210}
                y={cy + 280}
                appearAt={400}
                index={2}
              />
            )}
          </>
        )}

        <Caption
          text="12-15 structured blog topics generated"
          appearAt={420}
          position="top"
          size="large"
          highlight
        />
      </Sequence>

      {/* ========== STAGE 4: OUTPUT ========== */}
      <Sequence from={FRAMES.STAGE4_START} durationInFrames={FRAMES.STAGE4_END - FRAMES.STAGE4_START}>
        <Caption
          text="STAGE 4: Delivery"
          appearAt={0}
          disappearAt={60}
          position="top"
          size="medium"
          highlight
        />

        {/* Notion output */}
        <WorkflowNode
          label="Save to Notion"
          type="integration"
          icon="database"
          x={cx - 200}
          y={cy - 50}
          appearAt={30}
          isActive={frame - FRAMES.STAGE4_START > 60}
        />

        {/* Aggregate */}
        <WorkflowNode
          label="Aggregate"
          type="flow"
          icon="merge"
          x={cx}
          y={cy - 50}
          appearAt={50}
          isActive={frame - FRAMES.STAGE4_START > 80}
        />

        {/* Slack notification */}
        <WorkflowNode
          label="Slack Alert"
          type="integration"
          icon="slack"
          x={cx + 200}
          y={cy - 50}
          appearAt={70}
          isActive={frame - FRAMES.STAGE4_START > 100}
        />

        {/* Connections */}
        <ConnectionLine fromX={cx - 160} fromY={cy - 50} toX={cx - 40} toY={cy - 50} appearAt={60} isActive={frame - FRAMES.STAGE4_START > 75} />
        <ConnectionLine fromX={cx + 40} fromY={cy - 50} toX={cx + 160} toY={cy - 50} appearAt={85} isActive={frame - FRAMES.STAGE4_START > 100} />

        {/* Slack message preview */}
        {frame - FRAMES.STAGE4_START > 120 && (
          <div
            style={{
              position: 'absolute',
              left: cx - 280,
              top: cy + 100,
              width: 560,
              background: '#1a1d21',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              border: '1px solid #333',
              opacity: interpolate(frame - FRAMES.STAGE4_START - 120, [0, 30], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(frame - FRAMES.STAGE4_START - 120, [0, 30], [20, 0], { extrapolateRight: 'clamp' })}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: '#4A154B',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'system-ui' }}>n8n Marketing</div>
                <div style={{ fontSize: 12, color: '#888', fontFamily: 'system-ui' }}>8:32 AM</div>
              </div>
            </div>
            <div style={{ fontSize: 15, color: '#e0e0e0', fontFamily: 'system-ui', lineHeight: 1.6 }}>
              🌞 <strong>Happy Monday!</strong><br/><br/>
              Here are this week's <strong style={{ color: theme.colors.primary }}>12 fresh blog ideas</strong>, keywords, and target audiences...
            </div>
          </div>
        )}

        <Caption
          text="Topics saved to Notion database"
          appearAt={130}
          disappearAt={200}
          position="bottom"
          size="medium"
        />

        <Caption
          text="Team notified in Slack. Ready to write!"
          appearAt={180}
          position="bottom"
          size="large"
          highlight
        />
      </Sequence>

      {/* ========== RESULTS + CTA ========== */}
      <Sequence from={FRAMES.RESULTS_START} durationInFrames={FRAMES.RESULTS_END - FRAMES.RESULTS_START}>
        {/* Screenshot reveal with cinematic animation */}
        {frame >= FRAMES.RESULTS_START && frame < FRAMES.RESULTS_START + 180 && (() => {
          const localFrame = frame - FRAMES.RESULTS_START;
          const scale = spring({
            frame: localFrame,
            fps,
            config: { damping: 18, stiffness: 80, mass: 0.9 },
          });
          const opacity = interpolate(localFrame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
          const glowPulse = 0.5 + Math.sin(localFrame * 0.08) * 0.3;

          return (
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) scale(${scale * 0.85})`,
                opacity,
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: `0 0 ${60 * glowPulse}px ${theme.colors.primary}50, 0 20px 60px rgba(0,0,0,0.6)`,
                border: `3px solid ${theme.colors.primary}60`,
              }}
            >
              <Img
                src={staticFile('blog_topics.png')}
                style={{
                  maxWidth: 900,
                  maxHeight: 700,
                  objectFit: 'contain',
                }}
              />
            </div>
          );
        })()}

        <Caption
          text="The actual output. Every Monday."
          appearAt={20}
          disappearAt={120}
          position="top"
          size="large"
          highlight
        />

        {/* Stats appear after screenshot fades */}
        <Stats
          stats={[
            { value: '5hrs', label: '→ 0hrs research' },
            { value: '12-15', label: 'topics weekly' },
            { value: '100%', label: 'automated' },
          ]}
          appearAt={160}
        />

        <Caption
          text="From idea drought to content abundance."
          appearAt={220}
          disappearAt={290}
          position="bottom"
          size="large"
        />

        <Caption
          text="Every Monday. Like clockwork."
          appearAt={270}
          disappearAt={340}
          position="bottom"
          size="xlarge"
          highlight
        />

        {/* Final logo - centered at bottom */}
        <Logo appearAt={300} position="bottom" size={55} />

        <Caption
          text="Transform Labs — Automate Everything"
          appearAt={340}
          position="bottom"
          size="medium"
        />
      </Sequence>
    </AbsoluteFill>
  );
};

import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface AgentWorkScreenProps {
  type: 'outliner' | 'writer' | 'critic' | 'reviser' | 'selector';
  appearAt: number;
  disappearAt?: number;
}

export const AgentWorkScreen: React.FC<AgentWorkScreenProps> = ({
  type,
  appearAt,
  disappearAt,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (frame < appearAt) return null;
  if (disappearAt && frame > disappearAt) return null;

  const localFrame = frame - appearAt;

  // Smooth entrance - higher damping = less bounce, smoother animation
  const entranceProgress = spring({
    frame: localFrame,
    fps,
    config: { damping: 20, stiffness: 100, mass: 0.8 },
  });

  const opacity = interpolate(localFrame, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(entranceProgress, [0, 1], [0.95, 1]);

  // Exit animation - smooth fade out over 20 frames
  const exitOpacity = disappearAt
    ? interpolate(frame, [disappearAt - 20, disappearAt], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  const content = getAgentContent(type, localFrame);

  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        right: 80,
        top: height / 2 - 200,
        opacity: opacity * exitOpacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Monitor frame */}
      <div
        style={{
          background: '#0a0a0f',
          borderRadius: 16,
          border: `2px solid ${theme.colors.primary}40`,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${theme.colors.primary}20`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: theme.colors.backgroundLight,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            borderBottom: `1px solid ${theme.colors.surface}`,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
          <span
            style={{
              marginLeft: 12,
              fontSize: 14,
              fontWeight: 600,
              color: theme.colors.textSecondary,
              fontFamily: theme.fonts.mono,
            }}
          >
            {content.title}
          </span>
        </div>

        {/* Content area */}
        <div
          style={{
            padding: '24px 28px',
            minHeight: 280,
            fontFamily: theme.fonts.primary,
          }}
        >
          {content.element}
        </div>
      </div>
    </div>
  );
};

function getAgentContent(type: string, localFrame: number) {
  switch (type) {
    case 'selector':
      return {
        title: 'Topic Selector Agent',
        element: <TopicSelectorContent frame={localFrame} />,
      };
    case 'outliner':
      return {
        title: 'Outline Creator Agent',
        element: <OutlinerContent frame={localFrame} />,
      };
    case 'writer':
      return {
        title: 'Thread Writer Agent',
        element: <WriterContent frame={localFrame} />,
      };
    case 'critic':
      return {
        title: 'Quality Critic Agent',
        element: <CriticContent frame={localFrame} />,
      };
    case 'reviser':
      return {
        title: 'Thread Reviser Agent',
        element: <ReviserContent frame={localFrame} />,
      };
    default:
      return { title: 'Agent', element: null };
  }
}

// Topic Selector - scanning articles
const TopicSelectorContent: React.FC<{ frame: number }> = ({ frame }) => {
  const articles = [
    { title: 'OpenAI announces GPT-5...', score: 72 },
    { title: 'Google DeepMind breakthrough...', score: 68 },
    { title: 'AI regulation in EU moves forward...', score: 89 },
    { title: 'Meta releases new LLM...', score: 61 },
  ];

  return (
    <div>
      <div style={{ color: theme.colors.textMuted, fontSize: 14, marginBottom: 16 }}>
        Analyzing articles for thread potential...
      </div>
      {articles.map((article, i) => {
        const showAt = i * 20;
        const isSelected = i === 2;
        const show = frame > showAt;
        const highlight = frame > 80 && isSelected;

        return (
          <div
            key={i}
            style={{
              opacity: show ? 1 : 0,
              padding: '12px 16px',
              marginBottom: 8,
              background: highlight ? `${theme.colors.primary}20` : theme.colors.backgroundLight,
              borderRadius: 8,
              border: highlight ? `2px solid ${theme.colors.primary}` : '2px solid transparent',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transform: highlight ? 'scale(1.02)' : 'scale(1)',
            }}
          >
            <span style={{ color: theme.colors.textPrimary, fontSize: 16 }}>
              {article.title}
            </span>
            <span
              style={{
                color: highlight ? theme.colors.primary : theme.colors.textMuted,
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {frame > showAt + 15 ? `${article.score}%` : '...'}
            </span>
          </div>
        );
      })}
      {frame > 90 && (
        <div style={{ color: theme.colors.success, fontSize: 16, marginTop: 16, fontWeight: 600 }}>
          ✓ Selected: AI regulation story (89% relevance)
        </div>
      )}
    </div>
  );
};

// Outliner - creating thread structure
const OutlinerContent: React.FC<{ frame: number }> = ({ frame }) => {
  const points = [
    'Hook: Why AI regulation matters NOW',
    'Point 1: What the EU is proposing',
    'Point 2: Impact on US tech companies',
    'Point 3: The contrarian take',
    'CTA: What CTOs should do today',
  ];

  return (
    <div>
      <div style={{ color: theme.colors.nodeAI, fontSize: 14, marginBottom: 16, fontFamily: theme.fonts.mono }}>
        Generating thread outline...
      </div>
      {points.map((point, i) => {
        const showAt = i * 25;
        const charsToShow = Math.max(0, Math.floor((frame - showAt) / 1.2));
        const text = point.slice(0, charsToShow);

        return (
          <div
            key={i}
            style={{
              opacity: frame > showAt ? 1 : 0,
              padding: '8px 0',
              display: 'flex',
              gap: 12,
            }}
          >
            <span style={{ color: theme.colors.primary, fontSize: 18, fontWeight: 700 }}>
              {i + 1}.
            </span>
            <span style={{ color: theme.colors.textPrimary, fontSize: 18 }}>
              {text}
              {text.length < point.length && frame > showAt && (
                <span style={{ color: theme.colors.primary }}>|</span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Writer - writing tweets
const WriterContent: React.FC<{ frame: number }> = ({ frame }) => {
  const tweet = "The EU just dropped a bombshell on AI regulation.\n\nBut here's what most people are missing:\n\nThis isn't about slowing down AI.\nIt's about who gets to control it.\n\nThread 🧵";
  const charsToShow = Math.floor(frame / 1.5);
  const displayText = tweet.slice(0, charsToShow);

  return (
    <div>
      <div style={{ color: theme.colors.nodeAI, fontSize: 14, marginBottom: 16, fontFamily: theme.fonts.mono }}>
        Writing thread hook...
      </div>
      <div
        style={{
          background: theme.colors.background,
          padding: 20,
          borderRadius: 12,
          border: `1px solid ${theme.colors.surface}`,
        }}
      >
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: theme.colors.primary,
            }}
          />
          <div>
            <div style={{ color: theme.colors.textPrimary, fontWeight: 700 }}>Transform Labs</div>
            <div style={{ color: theme.colors.textMuted, fontSize: 14 }}>@TransformLabsHQ</div>
          </div>
        </div>
        <div
          style={{
            color: theme.colors.textPrimary,
            fontSize: 20,
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
          }}
        >
          {displayText}
          {displayText.length < tweet.length && (
            <span style={{ color: theme.colors.primary }}>|</span>
          )}
        </div>
        {frame > 120 && (
          <div style={{ color: theme.colors.textMuted, fontSize: 14, marginTop: 12 }}>
            280/280 characters
          </div>
        )}
      </div>
    </div>
  );
};

// Critic - scoring and feedback
const CriticContent: React.FC<{ frame: number }> = ({ frame }) => {
  const criteria = [
    { name: 'Hook Strength', score: 8, note: 'Strong opening' },
    { name: 'Value Density', score: 7, note: 'Add more data' },
    { name: 'Contrarian Angle', score: 9, note: 'Excellent' },
    { name: 'CTA Clarity', score: 6, note: 'Needs work' },
  ];

  const overallScore = frame > 100 ? 7.5 : null;

  return (
    <div>
      <div style={{ color: '#EF4444', fontSize: 14, marginBottom: 16, fontFamily: theme.fonts.mono }}>
        Evaluating thread quality... BE RUTHLESS.
      </div>
      {criteria.map((c, i) => {
        const showAt = i * 20;
        return (
          <div
            key={i}
            style={{
              opacity: frame > showAt ? 1 : 0,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: `1px solid ${theme.colors.surface}`,
            }}
          >
            <span style={{ color: theme.colors.textPrimary, fontSize: 16 }}>{c.name}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ color: theme.colors.textMuted, fontSize: 14 }}>{c.note}</span>
              <span
                style={{
                  color: c.score >= 8 ? theme.colors.success : c.score >= 7 ? theme.colors.warning : '#EF4444',
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {frame > showAt + 10 ? `${c.score}/10` : '...'}
              </span>
            </div>
          </div>
        );
      })}
      {overallScore && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: theme.colors.warning + '20',
            borderRadius: 8,
            border: `2px solid ${theme.colors.warning}`,
          }}
        >
          <div style={{ color: theme.colors.warning, fontSize: 24, fontWeight: 800 }}>
            Overall: {overallScore}/10 — NEEDS REVISION
          </div>
        </div>
      )}
    </div>
  );
};

// Reviser - making edits
const ReviserContent: React.FC<{ frame: number }> = ({ frame }) => {
  return (
    <div>
      <div style={{ color: theme.colors.success, fontSize: 14, marginBottom: 16, fontFamily: theme.fonts.mono }}>
        Applying revisions...
      </div>
      <div
        style={{
          background: theme.colors.background,
          padding: 20,
          borderRadius: 12,
          border: `1px solid ${theme.colors.surface}`,
        }}
      >
        <div style={{ color: theme.colors.textMuted, fontSize: 14, marginBottom: 8 }}>
          CTA (Tweet 5) - Revised:
        </div>
        <div style={{ position: 'relative' }}>
          {frame < 60 && (
            <span
              style={{
                color: '#EF4444',
                textDecoration: 'line-through',
                fontSize: 18,
              }}
            >
              Think about this for your company.
            </span>
          )}
          {frame >= 60 && (
            <span style={{ color: theme.colors.success, fontSize: 18 }}>
              Here's your 3-step action plan for Monday:
              {frame >= 80 && '\n\n1. Audit your AI vendors'}
              {frame >= 95 && '\n2. Review data processing agreements'}
              {frame >= 110 && '\n3. Schedule a compliance check'}
            </span>
          )}
        </div>
      </div>
      {frame > 120 && (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: theme.colors.success + '20',
            borderRadius: 8,
            border: `2px solid ${theme.colors.success}`,
          }}
        >
          <div style={{ color: theme.colors.success, fontSize: 20, fontWeight: 700 }}>
            ✓ Revised score: 8.5/10 — APPROVED
          </div>
        </div>
      )}
    </div>
  );
};

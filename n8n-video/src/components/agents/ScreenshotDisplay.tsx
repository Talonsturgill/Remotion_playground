import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

interface ScreenshotDisplayProps {
  src: string;
  title: string;
  appearAt: number;
  disappearAt?: number;
  scale?: number;
}

// Content HQ - Thread Ready for Review (slack_pic2)
const ContentHQScreen: React.FC = () => (
  <div style={{ width: 850, background: '#fff', padding: 24, fontFamily: theme.fonts.primary }}>
    {/* Header with icon */}
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
      <div style={{ fontSize: 24 }}>🧪</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a', marginBottom: 4 }}>
          New X Thread Ready for Review
        </div>
        <div style={{ color: '#666', fontSize: 14, marginBottom: 8 }}>
          <span style={{ fontWeight: 600, color: '#333' }}>Topic:</span> Are AI agents ready for the workplace? A new benchmark raises doubts
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: '#666', marginBottom: 12 }}>
          <span><strong>Score:</strong> 7.4/10</span>
          <span><strong>Tweets:</strong> 5</span>
          <span><strong>Iterations:</strong> 3</span>
        </div>
        <div style={{ borderTop: '1px solid #e5e5e5', paddingTop: 12, fontSize: 14, color: '#333', lineHeight: 1.6 }}>
          Vendors promise autonomous AI employees. But new benchmarks show agents bombing basic consulting and banking tasks. Here's the reality check every CTO needs 🧪
        </div>
        <div style={{ marginTop: 16, fontSize: 13, color: '#555', lineHeight: 1.7 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>2/</strong> TAU-bench tested AI agents on real workflows from consulting, investment banking, and law firms. The finding? Models that ace coding tests still struggle with actual white-collar work.
          </div>
          <div style={{ marginBottom: 8 }}>
            <strong>3/</strong> The problem isn't the AI, but the complexity of enterprise work. While agents handle narrow, repeatable tasks fine, real work requires juggling context, making judgment calls, and tolerating ambiguity.
          </div>
          <div>
            <strong>4/</strong> Human-in-the-loop automation isn't settling. It's strategic. You get ROI today instead of betting on agents that aren't ready.
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Slack Thread Posted notification (slack_pic)
const SlackPostedScreen: React.FC = () => (
  <div style={{ width: 850, background: '#fff', fontFamily: theme.fonts.primary }}>
    {/* Slack header */}
    <div style={{ background: '#f8f8f8', padding: '8px 16px', borderBottom: '1px solid #e5e5e5', fontSize: 12, color: '#666' }}>
      Automated with this <span style={{ color: theme.colors.primary }}>n8n workflow</span>
    </div>
    {/* Message */}
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, #0077b5 100%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 700, fontSize: 14
        }}>n8n</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1d1c1d' }}>n8n Marketing</span>
            <span style={{ background: '#e8e8e8', padding: '2px 6px', borderRadius: 4, fontSize: 11, color: '#616061' }}>APP</span>
            <span style={{ fontSize: 12, color: '#616061' }}>10:00 AM</span>
          </div>
          <div style={{ fontSize: 15, color: '#1d1c1d', marginBottom: 8 }}>
            <span style={{ fontSize: 18, marginRight: 6 }}>👋</span>
            <strong>Thread Posted!</strong>
          </div>
          <div style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>
            <strong>Title:</strong> Consumers spent more on mobile apps than games in 2025, driven by AI app adoption
          </div>
          <div style={{ fontSize: 14, color: '#333', marginBottom: 8 }}>
            <strong>Tweets:</strong> 6
          </div>
          <div style={{ fontSize: 14, color: '#333', marginBottom: 12 }}>
            <strong>Hook:</strong>
            <div style={{ borderLeft: '4px solid #e5e5e5', paddingLeft: 12, marginTop: 4, color: '#555' }}>
              Something wild just happened in mobile app spending. For the first time ever, people paid more for productivity apps than games. The Utility Flip is here, and it redefines how you should think about enterprise AI investment 🧪...
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <span style={{ color: theme.colors.primary, fontSize: 14 }}>View Thread on X</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ScreenshotDisplay: React.FC<ScreenshotDisplayProps> = ({
  src,
  title,
  appearAt,
  disappearAt,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
  const scaleAnim = interpolate(entranceProgress, [0, 1], [0.95, 1]) * scale;

  // Exit animation - smooth fade out over 20 frames
  const exitOpacity = disappearAt
    ? interpolate(frame, [disappearAt - 20, disappearAt], [1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 1;

  // Determine which screen to show based on src
  const isSlackPosted = src.includes('slack_pic.png') || src === 'slack_pic.png';
  const isContentHQ = src.includes('slack_pic2') || src === 'slack_pic2.png';

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%, -50%) scale(${scaleAnim})`,
        opacity: opacity * exitOpacity,
      }}
    >
      {/* Monitor frame */}
      <div
        style={{
          background: '#0a0a0f',
          borderRadius: 16,
          border: `3px solid ${theme.colors.primary}50`,
          overflow: 'hidden',
          boxShadow: `0 0 80px ${theme.colors.primary}30, 0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: theme.colors.backgroundLight,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            borderBottom: `1px solid ${theme.colors.surface}`,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22C55E' }} />
          <span
            style={{
              marginLeft: 16,
              fontSize: 16,
              fontWeight: 700,
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.primary,
              letterSpacing: 0.5,
            }}
          >
            {title}
          </span>
        </div>

        {/* CSS-based screenshot content */}
        {isContentHQ ? <ContentHQScreen /> : isSlackPosted ? <SlackPostedScreen /> : <SlackPostedScreen />}
      </div>
    </div>
  );
};

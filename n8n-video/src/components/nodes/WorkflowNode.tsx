import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../../theme';

export type NodeType = 'trigger' | 'action' | 'ai' | 'integration' | 'flow';

interface WorkflowNodeProps {
  label: string;
  type: NodeType;
  x: number;
  y: number;
  appearAt: number;
  isActive?: boolean;
  icon?: string;
  scale?: number;
}

const nodeColors: Record<NodeType, string> = {
  trigger: theme.colors.nodeTrigger,
  action: theme.colors.nodeAction,
  ai: theme.colors.nodeAI,
  integration: theme.colors.nodeIntegration,
  flow: theme.colors.nodeFlow,
};

const nodeIcons: Record<string, string> = {
  schedule: '⏰',
  rss: '📡',
  merge: '🔀',
  filter: '🔍',
  limit: '📊',
  aggregate: '📦',
  ai: '🤖',
  code: '💻',
  notion: '📝',
  slack: '💬',
  http: '🌐',
  branch: '⚡',
  quality: '✅',
};

export const WorkflowNode: React.FC<WorkflowNodeProps> = ({
  label,
  type,
  x,
  y,
  appearAt,
  isActive = false,
  icon,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const entranceProgress = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  const opacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scaleAnim = interpolate(entranceProgress, [0, 1], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  // Active pulse animation
  const pulseFrame = (frame - appearAt) % 60;
  const pulse = isActive
    ? interpolate(pulseFrame, [0, 30, 60], [1, 1.05, 1])
    : 1;

  // Glow effect for active nodes
  const glowOpacity = isActive
    ? interpolate(pulseFrame, [0, 30, 60], [0.3, 0.6, 0.3])
    : 0;

  const nodeColor = nodeColors[type];
  const displayIcon = icon ? nodeIcons[icon] || '⬛' : nodeIcons[type] || '⬛';

  const nodeSize = 80 * scale;

  if (frame < appearAt) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: x - nodeSize / 2,
        top: y - nodeSize / 2,
        opacity,
        transform: `scale(${scaleAnim * pulse})`,
      }}
    >
      {/* Glow effect */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            width: nodeSize + 30,
            height: nodeSize + 30,
            left: -15,
            top: -15,
            borderRadius: 20,
            background: nodeColor,
            opacity: glowOpacity,
            filter: 'blur(20px)',
          }}
        />
      )}

      {/* Node body */}
      <div
        style={{
          width: nodeSize,
          height: nodeSize,
          borderRadius: 16,
          background: `linear-gradient(135deg, ${theme.colors.backgroundLight} 0%, ${theme.colors.surface} 100%)`,
          border: `3px solid ${isActive ? nodeColor : theme.colors.surface}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isActive
            ? `0 0 30px ${nodeColor}60`
            : '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Icon */}
        <span style={{ fontSize: 28 * scale }}>{displayIcon}</span>
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          top: nodeSize + 8,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          fontSize: 14 * scale,
          fontWeight: 600,
          color: theme.colors.textPrimary,
          fontFamily: theme.fonts.primary,
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
        }}
      >
        {label}
      </div>

      {/* Connection points */}
      <div
        style={{
          position: 'absolute',
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: nodeColor,
          border: `2px solid ${theme.colors.background}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: nodeColor,
          border: `2px solid ${theme.colors.background}`,
        }}
      />
    </div>
  );
};

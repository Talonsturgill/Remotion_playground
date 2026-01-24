// Transform Labs Brand Theme
export const theme = {
  colors: {
    // Brand colors
    primary: '#00A0E4', // Transform Labs blue
    primaryLight: '#38BDF8', // Lighter blue for accents
    primaryDark: '#0284C7', // Darker blue

    // Backgrounds
    background: '#0F172A', // Dark slate
    backgroundLight: '#1E293B', // Lighter slate for cards
    surface: '#334155', // Surface elements

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    // Status colors
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',

    // Node colors
    nodeTrigger: '#8B5CF6', // Purple for triggers
    nodeAction: '#00A0E4', // Blue for actions
    nodeAI: '#EC4899', // Pink for AI agents
    nodeIntegration: '#10B981', // Green for integrations
    nodeFlow: '#F59E0B', // Amber for flow control
  },

  fonts: {
    primary: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },

  // Video specs for LinkedIn
  video: {
    width: 1080,
    height: 1080,
    fps: 30,
    durationInSeconds: 65,
  },
};

export type Theme = typeof theme;

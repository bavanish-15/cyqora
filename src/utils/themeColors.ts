/**
 * CYQORA design tokens — light-first, muted, professional palette.
 * Single source of truth for charts and TS consumers.
 */
export const CYQORA_THEME = {
  bg: {
    primary: '#F7F6F2',
    secondary: '#FFFFFF',
    elevated: '#F1F0EC',
  },
  surface: {
    card: '#FFFFFF',
    cardElevated: '#F1F0EC',
    input: '#FFFFFF',
    dropdown: '#FFFFFF',
    modal: '#FFFFFF',
    secondary: '#E9E7E1',
  },
  text: {
    primary: '#292927',
    secondary: '#6F6D68',
    muted: '#6F6D68',
    disabled: '#A8A69F',
  },
  accent: {
    primary: '#6F6275',
    secondary: '#71859A',
    hover: '#5A5160',
    subtleBg: 'rgba(111, 98, 117, 0.10)',
    hoverBg: 'rgba(111, 98, 117, 0.14)',
  },
  border: {
    default: '#DCDAD4',
    strong: '#D0CEC6',
    hover: 'rgba(111, 98, 117, 0.35)',
  },
  risk: {
    critical: '#A87570',
    high: '#A87570',
    moderate: '#B49562',
    low: '#718C78',
  },
  status: {
    positive: '#718C78',
    warning: '#B49562',
    critical: '#A87570',
    info: '#71859A',
  },
  chart: {
    primary: '#6F6275',
    secondary: '#71859A',
    tertiary: '#718C78',
    quaternary: '#B49562',
    baseline: '#DCDAD4',
    riskHighlight: '#A87570',
    positiveOutcome: '#718C78',
    grid: 'rgba(41, 41, 39, 0.06)',
    axis: '#6F6D68',
    tooltipBg: '#FFFFFF',
    tooltipBorder: '#DCDAD4',
  },
} as const;

/** Ordered chart series colors (muted only). */
export const CHART_SERIES = [
  CYQORA_THEME.accent.primary,
  CYQORA_THEME.accent.secondary,
  CYQORA_THEME.status.positive,
  CYQORA_THEME.status.warning,
  CYQORA_THEME.status.critical,
  '#8A7F8E',
  '#8B9AAB',
] as const;

export type CyqoraTheme = typeof CYQORA_THEME;

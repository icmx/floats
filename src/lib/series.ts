export const SERIES_COLORS = [
  'var(--color-series-indigo)',
  'var(--color-series-green)',
  'var(--color-series-amber)',
  'var(--color-series-pink)',
  'var(--color-series-cyan)',
  'var(--color-series-orange)',
];

export const getSeriesColor = (seriesIndex: number): string => {
  return SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
};

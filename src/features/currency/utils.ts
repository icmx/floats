import { SERIES_COLORS } from './constants';

export const getSeriesColor = (seriesIndex: number): string => {
  return SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
};

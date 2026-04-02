import { SERIES_COLORS } from './constants';

/**
 * @todo Document this entry
 * @todo Test this entry
 */
export const getSeriesColor = (seriesIndex: number): string => {
  return SERIES_COLORS[seriesIndex % SERIES_COLORS.length];
};

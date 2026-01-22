import { lazy, Suspense, type FunctionComponent } from 'react';
import { useFractionDigits } from '../../../hooks/useFractionDigitsStore';
import { Loading } from '../../common/Loading';
import type { PlotterProps } from './Plotter.types';

const StockChart = lazy(() => import('@highcharts/react/stock'));

// @todo: move to CSS
const CHART_COLORS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export const Plotter: FunctionComponent<PlotterProps> = ({
  series,
}) => {
  const [fractionDigits] = useFractionDigits();

  return (
    <Suspense fallback={<Loading />}>
      <StockChart
        options={{
          chart: {
            style: {
              color: 'var(--color-text)',
            },
            backgroundColor: 'var(--color-page)',
          },
          xAxis: {
            labels: {
              style: {
                color: 'var(--color-text)',
              },
            },
            gridLineColor: 'var(--color-line)',
          },
          yAxis: {
            labels: {
              style: {
                color: 'var(--color-text)',
              },
            },
            gridLineColor: 'var(--color-line)',
          },
          tooltip: {
            style: {
              color: 'var(--color-text)',
            },
            backgroundColor: 'var(--color-chip)',
          },

          rangeSelector: {
            buttons: [
              {
                type: 'month',
                count: 1,
              },
              {
                type: 'month',
                count: 3,
              },
              {
                type: 'month',
                count: 6,
              },
              {
                type: 'ytd',
                count: 1,
              },
              {
                type: 'year',
                count: 1,
              },
              {
                type: 'year',
                count: 5,
              },
              {
                type: 'year',
                count: 10,
              },
              {
                type: 'all',
                text: 'All',
              },
            ],
          },

          accessibility: {
            enabled: false,
          },
          credits: {
            enabled: false,
          },
          series: series.map((value, index) => {
            const isSingleSeries = series.length === 1;
            const type = isSingleSeries ? 'area' : 'line';
            const color = CHART_COLORS[index];

            return {
              ...value,
              type,
              color,
              animation: true,
              tooltip: {
                valueDecimals: fractionDigits,
                pointFormat: '{series.name}: {point.y}',
              },
            };
          }),
          plotOptions: {
            area: {
              threshold: null,
            },
          },
        }}
      />
    </Suspense>
  );
};

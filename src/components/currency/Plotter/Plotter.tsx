import { Suspense, type FunctionComponent } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { useFractionDigits } from '../../../stores/fractionDigitsStore';
import { Loading } from '../../common/Loading';
import type { PlotterProps } from './Plotter.types';

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
  const isSingleSeries = series.length === 1;

  return (
    <Suspense fallback={<Loading />}>
      <HighchartsReact
        constructorType={'stockChart'}
        highcharts={Highcharts}
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
                text: '1m',
              },
              {
                type: 'month',
                count: 3,
                text: '3m',
              },
              {
                type: 'month',
                count: 6,
                text: '6m',
              },
              {
                type: 'ytd',
                count: 1,
                text: 'YTD',
              },
              {
                type: 'year',
                count: 1,
                text: '1Y',
              },
              {
                type: 'year',
                count: 5,
                text: '5Y',
              },
              {
                type: 'year',
                count: 10,
                text: '10Y',
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
          legend: {
            enabled: !isSingleSeries,
            verticalAlign: 'top',
            layout: 'horizontal',
            align: 'center',
          },
          series: series.map((value, index) => {
            const type = isSingleSeries ? 'area' : 'line';
            const color = CHART_COLORS[index % CHART_COLORS.length];

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

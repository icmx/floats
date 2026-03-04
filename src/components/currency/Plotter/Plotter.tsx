import { Suspense, type FunctionComponent } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { Loading } from '../../common/Loading';
import { EXPLORE_FRACTION_DIGITS } from '../../../utils/currency';
import type { PlotterProps } from './Plotter.types';

const CHART_COLORS = [
  'var(--chart-line-indigo)',
  'var(--chart-line-green)',
  'var(--chart-line-amber)',
  'var(--chart-line-pink)',
  'var(--chart-line-cyan)',
  'var(--chart-line-orange)',
];

export const Plotter: FunctionComponent<PlotterProps> = ({
  series,
}) => {
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
            selected: 1,
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
            itemStyle: {
              color: 'var(--color-text)',
            },

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
                valueDecimals: EXPLORE_FRACTION_DIGITS,
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

import {
  useEffect,
  useImperativeHandle,
  useRef,
  type FunctionComponent,
} from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';
import { EXPLORE_FRACTION_DIGITS, MS_3_MONTHS } from '../../constants';
import { getSeriesColor } from '../../utils';
import type { DataChartProps } from './DataChart.types';

export const DataChart: FunctionComponent<DataChartProps> = ({
  series,
  ref,
}) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);

  useImperativeHandle(ref, () => {
    return {
      scrollToRecent: () => {
        const chart = chartRef.current?.chart;

        if (!chart) {
          return;
        }

        const xAxis = chart.xAxis[0];

        if (!xAxis) {
          return;
        }

        const extremes = xAxis.getExtremes();

        const newMax = extremes.dataMax;
        const newMin = newMax - MS_3_MONTHS;

        const redraw = true;
        const animation = false;

        xAxis.setExtremes(newMin, newMax, redraw, animation);
      },
    };
  });

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      chartRef.current?.chart?.reflow();
    });

    observer.observe(document.body);

    return () => {
      observer.disconnect();
    };
  }, []);

  const isSingleSeries = series.length === 1;

  return (
    <HighchartsReact
      ref={chartRef}
      highcharts={Highcharts}
      constructorType={'stockChart'}
      containerProps={{
        style: {
          height: '65vh',
          width: '100%',
        },
      }}
      options={{
        chart: {
          style: {
            color: 'var(--color-text)',
          },
          backgroundColor: 'var(--color-body)',
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
          inputStyle: {
            color: 'var(--color-link)',
          },
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
          const color = getSeriesColor(index);

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
  );
};

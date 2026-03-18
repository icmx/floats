import { useEffect, useRef, type FunctionComponent } from 'react';
import Highcharts from 'highcharts/highstock';
import HighchartsReact, {
  type HighchartsReactRefObject,
} from 'highcharts-react-official';
import { EXPLORE_FRACTION_DIGITS } from '../../../constants/common';
import { getSeriesColor } from '../../../utils/currency';
import type { DataChartProps } from './DataChart.types';
import styles from './DataChart.module.css';

export const DataChart: FunctionComponent<DataChartProps> = ({
  series,
}) => {
  const chartRef = useRef<HighchartsReactRefObject>(null);

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
    <div className={styles.DataChartContainer}>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        constructorType={'stockChart'}
        containerProps={{
          style: {
            height: '100%',
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
    </div>
  );
};

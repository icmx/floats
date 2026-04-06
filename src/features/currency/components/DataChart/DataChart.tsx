import {
  type FunctionComponent,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  type HighchartsReactRefObject,
  Legend,
  Tooltip,
} from '@highcharts/react';
import { StockChart, StockSeries } from '@highcharts/react/Stock';
import { EXCHANGE_CURRENCY_NUMBER_FRACTION_DIGITS } from '@/lib/format';
import { getSeriesColor } from '@/lib/series';
import { MS_3_MONTHS } from '../../constants';
import { type DataChartProps } from './DataChart.types';

export const DataChart: FunctionComponent<DataChartProps> = ({
  series,
  ref,
}) => {
  const chartRef = useRef<HighchartsReactRefObject>(null);

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
    <StockChart
      ref={chartRef}
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
        },
        plotOptions: {
          area: {
            threshold: null,
          },
        },
      }}
    >
      <Legend
        enabled={!isSingleSeries}
        verticalAlign="top"
        layout="horizontal"
        align="center"
      />
      <Tooltip
        valueDecimals={EXCHANGE_CURRENCY_NUMBER_FRACTION_DIGITS}
        pointFormat="{series.name}: {point.y}"
      />
      {series.map((value, index) => {
        const type = isSingleSeries ? 'area' : 'line';
        const color = getSeriesColor(index);

        return (
          <StockSeries
            key={value.name}
            type={type}
            options={{
              color,
              showInNavigator: true,
            }}
            {...value}
          />
        );
      })}
    </StockChart>
  );
};

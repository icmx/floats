import { type FunctionComponent } from 'react';
import { StockChart } from '@highcharts/react/stock';
import { useChartPageData } from '../../api/client';

export const ChartPage: FunctionComponent = () => {
  // @todo: make small links to other charts
  // const symbolCards = useSymbolCards();
  const currencyChartData = useChartPageData();

  const { name, data } = currencyChartData || {};

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>

      {currencyChartData && (
        <StockChart
          options={{
            credits: {
              enabled: false,
            },
            series: [
              {
                name: name,
                data: data,
                type: 'area',
                color: '#2962FF',
                animation: false,
                tooltip: {
                  valueDecimals: 2,
                  pointFormat: '{series.name}: {point.y}',
                },
              },
            ],
            plotOptions: {
              area: {
                threshold: null,
              },
            },
          }}
        ></StockChart>
      )}
    </>
  );
};

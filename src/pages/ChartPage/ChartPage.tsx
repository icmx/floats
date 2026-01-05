import { type FunctionComponent } from 'react';
import { StockChart } from '@highcharts/react/stock';
import { useCurrencyChartData } from '../../api/client';

export const ChartPage: FunctionComponent = () => {
  // @todo: make small links to other charts
  // const symbolCards = useSymbolCards();
  const currencyChartData = useCurrencyChartData();

  const { name, data } = currencyChartData || {};

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>

      {currencyChartData && (
        <StockChart
          options={{
            series: [
              {
                type: 'area',
                name: name,
                data: data,
                color: '#2962FF',
                lineWidth: 2,
                animation: false,
              },
            ],
          }}
        ></StockChart>
      )}
    </>
  );
};

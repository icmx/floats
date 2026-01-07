import { type FunctionComponent } from 'react';
import { StockChart } from '@highcharts/react/stock';
import { useChartPageData } from '../../api/client';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';

export const ChartPage: FunctionComponent = () => {
  const [fractionDigits] = useFractionDigits();
  const currencyChartData = useChartPageData();

  const { name, data } = currencyChartData || {};

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>

      <SymbolChips href={(id) => `/chart?by=${id}`} />

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
                  valueDecimals: fractionDigits,
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

import { useMemo, type FunctionComponent } from 'react';
import { StockChart } from '@highcharts/react/stock';
import { useCurrencies } from '../../api/client';
import { useSymbolCards } from '../../hooks/useSymbolCardsStore';

export const ChartPage: FunctionComponent = () => {
  // @todo: make small links to other charts
  const symbolCards = useSymbolCards();

  const { currencies } = useCurrencies();

  const currency = currencies.at(0);

  const data = useMemo<[number, number][]>(() => {
    return currency?.rates.map(({ date, rate }) => [date, rate]) || [];
  }, [currency]);

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>

      {currency && (
        <StockChart
          options={{
            series: [
              {
                type: 'area',
                name: `${currency.baseCode}${currency.quoteCode}`,
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

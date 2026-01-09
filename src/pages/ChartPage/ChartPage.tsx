import { useEffect, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { StockChart } from '@highcharts/react/stock';
import { fetchCurrenciesByNotation } from '../../api/client';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';

type Data = { name: string; data: [number, number][] };

const fetchChartPageData = async (notation: string): Promise<Data> => {
  const currencies = await fetchCurrenciesByNotation(notation);
  const currency = currencies.at(0);

  if (!currency) {
    throw new Error('No currencies');
  }

  const name: string = `${currency.baseCode}${currency.quoteCode}`;
  const data: [number, number][] = currency.rates.map(
    ({ date, rate }) => [date, rate]
  );

  return { name, data };
};

type ChartPageState = {
  isLoading: boolean;
  error: Error | null;
  data: Data;
  load: (notation: string) => Promise<void>;
};

const useChartPageStore = create<ChartPageState>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { name: '', data: [] },
    load: async (notation) => {
      set({ isLoading: true, error: null });

      try {
        const data = await fetchChartPageData(notation);

        set({ isLoading: false, error: null, data });
      } catch (cause) {
        set({ error: cause instanceof Error ? cause : new Error() });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

export const ChartPage: FunctionComponent = () => {
  const [fractionDigits] = useFractionDigits();

  const [searchParams] = useSearchParams();
  const notation = searchParams.get('by') || '';

  const { error, data } = useChartPageStore();
  const load = useChartPageStore((state) => state.load);

  useEffect(() => {
    load(notation);
  }, [notation, load]);

  return (
    <>
      <title>floats - Chart</title>
      <p>Chart Page</p>

      <SymbolChips href={(id) => `/chart?by=${id}`} />

      {error && (
        <p>
          Error: <code>{JSON.stringify(error.message, null, 2)}</code>
        </p>
      )}

      <StockChart
        options={{
          credits: {
            enabled: false,
          },
          series: [
            {
              name: data.name,
              data: data.data,
              type: 'area',
              color: '#2962FF',
              animation: true,
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
    </>
  );
};

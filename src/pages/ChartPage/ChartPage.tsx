import { useEffect, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { StockChart } from '@highcharts/react/stock';
import { fetchCurrenciesByNotation } from '../../api/client';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useFractionDigits } from '../../hooks/useFractionDigitsStore';
import type { AsyncPayload } from '../../types/common';

type Data = {
  series: {
    name: string;
    data: [number, number][];
  }[];
};

const usePageStore = create<
  AsyncPayload<Data> & { load: (notation: string) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { series: [] },
    load: async (notation) => {
      set({ isLoading: true });

      try {
        const data: Data = { series: [] };
        const currencies = await fetchCurrenciesByNotation(notation);

        currencies.forEach((currency) => {
          data.series.push({
            name: `${currency.baseCode}${currency.quoteCode}`,
            data: currency.rates.map(({ date, rate }) => [date, rate]),
          });
        });

        set({ error: null, data });
      } catch (error) {
        set({ error });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

const CHART_COLORS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f59e0b', // amber
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

export const ChartPage: FunctionComponent = () => {
  const [fractionDigits] = useFractionDigits();

  const [searchParams] = useSearchParams();
  const notation = searchParams.get('by') || '';

  const { error, data } = usePageStore();
  const load = usePageStore((state) => state.load);

  useEffect(() => {
    load(notation);
  }, [notation, load]);

  return (
    <>
      <SymbolChips href={(id) => `/chart?by=${id}`} />

      {error && <ErrorCallout error={error} />}

      <StockChart
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
            gridLineColor: 'var(--color-line)',
          },
          tooltip: {
            style: {
              color: 'var(--color-text)',
            },
            backgroundColor: 'var(--color-chip)',
          },

          credits: {
            enabled: false,
          },
          series: data.series.map((series, index) => {
            const isSingleSeries = data.series.length === 1;
            const type = isSingleSeries ? 'area' : 'line';
            const color = CHART_COLORS[index];

            return {
              ...series,
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
      ></StockChart>
    </>
  );
};

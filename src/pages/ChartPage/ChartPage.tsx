import { useEffect, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { fetchCurrenciesByNotation } from '../../api/client';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Plotter, type Series } from '../../components/currency/Plotter';
import { SymbolChips } from '../../components/currency/SymbolChips';
import type { AsyncPayload } from '../../types/common';

type Data = {
  series: Series;
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

export const ChartPage: FunctionComponent = () => {
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

      <Plotter series={data.series} />
    </>
  );
};

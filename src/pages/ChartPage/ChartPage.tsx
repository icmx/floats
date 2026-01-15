import { useEffect, type FunctionComponent } from 'react';
import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import {
  Plotter,
  type Series,
} from '../../components/currency/Plotter';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useSymbolsQueryParam } from '../../hooks/useSymbolsQueryParam';
import type { AsyncPayload } from '../../types/common';
import { parseSymbolStringsToTuples } from '../../utils/currency';

type Data = {
  series: Series;
};

const usePageStore = create<
  AsyncPayload<Data> & { load: (symbols: string[]) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { series: [] },
    load: async (symbols) => {
      set({ isLoading: true });

      try {
        const data: Data = { series: [] };

        const tuples = parseSymbolStringsToTuples(symbols);
        const currencies = await fetchCurrenciesBySymbols(tuples);

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
  const [symbols] = useSymbolsQueryParam();

  const { error, data } = usePageStore();
  const load = usePageStore((state) => state.load);

  useEffect(() => {
    load(symbols);
  }, [load, symbols]);

  return (
    <>
      <SymbolChips />

      {error && <ErrorCallout error={error} />}

      <Plotter series={data.series} />
    </>
  );
};

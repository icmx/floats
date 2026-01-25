import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import type { Series } from '../../components/currency/Plotter';
import type { AsyncPayload } from '../../types/common';
import { parseSymbolStringsToTuples } from '../../utils/currency';

export type Data = {
  series: Series;
};

export const usePageStore = create<
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
            data: [...currency.data],
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

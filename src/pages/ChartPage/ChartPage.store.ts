import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import type { Series } from '../../components/currency/Plotter';
import type { AsyncPayload } from '../../types/common';
import type { SymbolString } from '../../types/currency';

export type Data = {
  series: Series;
};

export const usePageStore = create<
  AsyncPayload<Data> & {
    load: (symbols: SymbolString[]) => Promise<void>;
  }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { series: [] },
    load: async (symbols) => {
      set({ isLoading: true });

      try {
        const data: Data = { series: [] };

        const currencies = await fetchCurrenciesBySymbols(symbols);

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

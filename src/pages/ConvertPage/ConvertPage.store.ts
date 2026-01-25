import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import type { AsyncPayload } from '../../types/common';
import type { CodeString } from '../../types/currency';
import { parseSymbolStringsToTuples } from '../../utils/currency';

export type Data = {
  rates: {
    symbol: [CodeString, CodeString];
    rate: number;
  }[];
};

export const usePageStore = create<
  AsyncPayload<Data> & { load: (symbols: string[]) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { rates: [] },
    load: async (symbols) => {
      set({ isLoading: true });

      try {
        const tuples = parseSymbolStringsToTuples(symbols);
        const currencies = await fetchCurrenciesBySymbols(tuples);

        const data: Data = {
          rates: currencies.map((currency) => {
            return {
              symbol: [currency.baseCode, currency.quoteCode],
              rate: currency.data.at(-1)?.[1] || 0,
            };
          }),
        };

        set({ error: null, data });
      } catch (error) {
        set({ error });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});

import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import type { AsyncPayload } from '../../types/common';
import type { CodeString, SymbolString } from '../../types/currency';

export type Data = {
  rates: {
    symbol: [CodeString, CodeString];
    rate: number;
  }[];
};

export const usePageStore = create<
  AsyncPayload<Data> & {
    load: (symbols: SymbolString[]) => Promise<void>;
  }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { rates: [] },
    load: async (symbols) => {
      set({ isLoading: true });

      try {
        const currencies = await fetchCurrenciesBySymbols(symbols);

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

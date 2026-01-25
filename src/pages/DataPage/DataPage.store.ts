import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import type { AsyncPayload } from '../../types/common';
import { parseSymbolStringsToTuples } from '../../utils/currency';

export type Data = {
  head: string[];
  body: {
    date: number;
    rates: (number | null)[];
  }[];
};

export const usePageStore = create<
  AsyncPayload<Data> & { load: (symbols: string[]) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { head: [], body: [] },
    load: async (symbols) => {
      set({ isLoading: true });

      try {
        const tuples = parseSymbolStringsToTuples(symbols);
        const currencies = await fetchCurrenciesBySymbols(tuples);

        const headers = currencies.map((currency) => {
          return `${currency.baseCode}${currency.quoteCode}`;
        });

        const head = ['date', ...headers];

        const ratesByDates = new Map<number, (number | null)[]>();
        const SIZE = currencies.length;

        currencies.forEach((currency, index) => {
          currency.data.forEach(([date, rate]) => {
            const ratesByDate =
              ratesByDates.get(date) || new Array(SIZE).fill(null);

            ratesByDate[index] = rate;

            ratesByDates.set(date, ratesByDate);
          });
        });

        const body: { date: number; rates: (number | null)[] }[] = [];

        Array.from(ratesByDates.entries())
          .sort(([prev], [next]) => {
            return prev - next;
          })
          .forEach(([date, rates]) => {
            body.push({ date, rates });
          });

        const data: Data = {
          head,
          body,
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

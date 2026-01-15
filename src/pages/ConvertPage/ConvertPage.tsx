import { useEffect, type FunctionComponent } from 'react';
import { create } from 'zustand';
import { fetchCurrenciesBySymbols } from '../../api/client';
import { Converter } from '../../components/currency/Converter';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Loading } from '../../components/common/Loading';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useSymbolsQueryParam } from '../../hooks/useSymbolsQueryParam';
import { type AsyncPayload } from '../../types/common';
import type { CodeString } from '../../types/currency';
import { parseSymbolStringsToTuples } from '../../utils/currency';

type Data = {
  rates: {
    symbol: [CodeString, CodeString];
    rate: number;
  }[];
};

const usePageStore = create<
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
              rate: currency.rates.at(-1)?.rate || 0,
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

export const ConvertPage: FunctionComponent = () => {
  const [symbols] = useSymbolsQueryParam();

  const {
    isLoading,
    error,
    data: { rates },
  } = usePageStore();
  const load = usePageStore((state) => state.load);

  useEffect(() => {
    load(symbols);
  }, [load, symbols]);

  return (
    <>
      <SymbolChips />

      {isLoading && <Loading />}

      {error && <ErrorCallout error={error} />}

      <form>
        {rates.map(({ symbol: [baseCode, quoteCode], rate }) => {
          return (
            <Converter
              key={`${baseCode}${quoteCode}`}
              baseAmount={1}
              baseCode={baseCode}
              quoteCode={quoteCode}
              rate={rate}
            />
          );
        })}
      </form>
    </>
  );
};

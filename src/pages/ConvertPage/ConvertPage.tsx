import { useEffect, type FunctionComponent } from 'react';
import { useSearchParams } from 'react-router';
import { create } from 'zustand';
import { fetchCurrenciesByNotation } from '../../api/client';
import { Converter } from '../../components/currency/Converter';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Loading } from '../../components/common/Loading';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { type AsyncPayload } from '../../types/common';
import type { CodeString } from '../../types/currency';

type Data = {
  rates: {
    symbol: [CodeString, CodeString];
    rate: number;
  }[];
};

const usePageStore = create<
  AsyncPayload<Data> & { load: (notation: string) => Promise<void> }
>()((set) => {
  return {
    isLoading: false,
    error: null,
    data: { rates: [] },
    load: async (notation) => {
      set({ isLoading: true });

      try {
        const currencies = await fetchCurrenciesByNotation(notation);

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
  const [searchParams] = useSearchParams();
  const notation = searchParams.get('by') || '';

  const {
    isLoading,
    error,
    data: { rates },
  } = usePageStore();
  const load = usePageStore((state) => state.load);

  useEffect(() => {
    load(notation);
  }, [notation, load]);

  return (
    <>
      <SymbolChips href={(id) => `/convert?by=${id}`} />

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

import { useEffect, type FunctionComponent } from 'react';
import { Converter } from '../../components/currency/Converter';
import { ErrorCallout } from '../../components/currency/ErrorCallout';
import { Loading } from '../../components/common/Loading';
import { SymbolChips } from '../../components/currency/SymbolChips';
import { useSymbolsFromQueryParam } from '../../hooks/useSymbolsFromQueryParam';
import { usePageStore } from './ConvertPage.store';

export const ConvertPage: FunctionComponent = () => {
  const { symbols, error: paramError } = useSymbolsFromQueryParam();

  const {
    isLoading,
    error: storeError,
    data: { rates },
  } = usePageStore();
  const load = usePageStore((state) => state.load);

  const error = paramError || storeError || null;

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

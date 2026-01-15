import { useMemo } from 'react';
import { useRawSearchParams } from './useRawSearchParams';

export type UseSymbolsQueryParam = () => [
  string[],
  (symbols: string[]) => void
];

export const SYMBOL_QUERY_PARAM_KEY = 'by';

export const SYMBOL_QUERY_PARAM_NAME_SEPARATOR = ',';

export const useSymbolsQueryParam: UseSymbolsQueryParam = () => {
  const [searchParams, setSearchParams] = useRawSearchParams();
  const notation = searchParams.get(SYMBOL_QUERY_PARAM_KEY) || '';

  const symbols = useMemo(() => {
    return notation.split(SYMBOL_QUERY_PARAM_NAME_SEPARATOR);
  }, [notation]);

  const setSymbols = (nextSymbols: string[]): void => {
    const nextNotation = nextSymbols.join(
      SYMBOL_QUERY_PARAM_NAME_SEPARATOR
    );

    setSearchParams(
      (prevSearchParams) => {
        prevSearchParams.set(SYMBOL_QUERY_PARAM_KEY, nextNotation);

        return prevSearchParams;
      },
      { replace: true }
    );
  };

  return [symbols, setSymbols];
};

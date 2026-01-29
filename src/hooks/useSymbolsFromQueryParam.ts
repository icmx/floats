import { useCallback, useMemo } from 'react';
import type { SymbolString } from '../types/currency';
import { validateSymbolString } from '../utils/currency';
import { useQueryParams } from './useQueryParams';

type Result = {
  symbols: SymbolString[];
  error: unknown;
};

const validate = (values: string[]): Result => {
  const symbols: SymbolString[] = [];

  for (const value of values) {
    try {
      const symbol = validateSymbolString(value);

      symbols.push(symbol);
    } catch (error) {
      return { symbols, error };
    }
  }

  return { symbols, error: null };
};

export type UseSymbolsFromUrl = {
  symbols: SymbolString[];
  error: unknown;
  setSymbols: (symbols: SymbolString[]) => void;
};

export const useSymbolsFromQueryParam = (): UseSymbolsFromUrl => {
  const { by, setBy } = useQueryParams();

  const { symbols, error } = useMemo(() => {
    return validate(by);
  }, [by]);

  const setSymbols = useCallback(
    (nextSymbols: SymbolString[]) => {
      setBy(nextSymbols);
    },
    [setBy]
  );

  return { symbols, error, setSymbols };
};

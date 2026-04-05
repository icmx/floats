import { useMemo } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { getCurrencies } from '../api/client';
import { type SymbolString, type Currency } from '../types';

export type SymbolsArray = SymbolString[];

export type SymbolsRecord<T> = Partial<Record<SymbolString, T>>;

export const useCurrenciesStore = create<{
  currencies: SymbolsRecord<Currency>;
  activeSymbols: SymbolsArray;
  loadingSymbols: SymbolsRecord<boolean>;
  errorsBySymbol: SymbolsRecord<unknown>;
}>()(() => {
  return {
    currencies: {},
    activeSymbols: [],
    loadingSymbols: {},
    errorsBySymbol: {},
  };
});

export const loadCurrenciesStore = async (
  symbols: SymbolString[]
): Promise<void> => {
  const state = useCurrenciesStore.getState();

  const symbolsToFetch = symbols.filter((symbol) => {
    return !state.currencies[symbol] && !state.loadingSymbols[symbol];
  });

  useCurrenciesStore.setState((state) => {
    if (symbolsToFetch.length === 0) {
      return {
        activeSymbols: symbols,
      };
    }

    const loadingSymbols = { ...state.loadingSymbols };

    symbolsToFetch.forEach((symbol) => {
      loadingSymbols[symbol] = true;
    });

    return {
      activeSymbols: symbols,
      loadingSymbols,
    };
  });

  if (symbolsToFetch.length === 0) {
    return;
  }

  const results = await getCurrencies(symbolsToFetch);

  useCurrenciesStore.setState((state) => {
    const nextCurrencies = { ...state.currencies };
    const nextErrors = { ...state.errorsBySymbol };
    const nextLoading = { ...state.loadingSymbols };

    results.forEach((result, index) => {
      const symbol = symbolsToFetch[index];

      nextLoading[symbol] = false;

      if (result.success) {
        nextCurrencies[symbol] = result.data;
        nextErrors[symbol] = undefined;
      } else {
        nextErrors[symbol] = result.error;
      }
    });

    return {
      currencies: nextCurrencies,
      loadingSymbols: nextLoading,
      errorsBySymbol: nextErrors,
    };
  });
};

export type UseCurrencies = {
  entries: Currency[];
  isLoading: boolean;
  errors: unknown[];
};

export const useCurrencies = (): UseCurrencies => {
  const { currencies, activeSymbols, loadingSymbols, errorsBySymbol } =
    useCurrenciesStore(
      useShallow((state) => {
        return {
          currencies: state.currencies,
          activeSymbols: state.activeSymbols,
          loadingSymbols: state.loadingSymbols,
          errorsBySymbol: state.errorsBySymbol,
        };
      })
    );

  return useMemo(() => {
    const entries = activeSymbols
      .map((activeSymbol) => currencies[activeSymbol])
      .filter((currency): currency is Currency => !!currency);

    const isLoading = activeSymbols.some(
      (activeSymbol) => loadingSymbols[activeSymbol] === true
    );

    const errors = activeSymbols
      .map((activeSymbol) => errorsBySymbol[activeSymbol])
      .filter((error) => !!error);

    return {
      entries,
      isLoading,
      errors,
    };
  }, [activeSymbols, currencies, loadingSymbols, errorsBySymbol]);
};

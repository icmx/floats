import { useMemo } from 'react';
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import { fetchCurrencyBySymbol } from '../api/client';
import type { Currency, SymbolString } from '../types/currency';

export type SymbolsRecord<T> = Partial<Record<SymbolString, T>>;

export const useCurrenciesStore = create<{
  currencies: SymbolsRecord<Currency>;
  activeSymbols: SymbolString[];
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

export const loadCurrenciesToStore = async (
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

  const results = await Promise.allSettled(
    symbolsToFetch.map(async (symbol) => {
      return {
        symbol,
        currency: await fetchCurrencyBySymbol(symbol),
      };
    })
  );

  useCurrenciesStore.setState((state) => {
    const nextCurrencies = { ...state.currencies };
    const nextErrors = { ...state.errorsBySymbol };
    const nextLoading = { ...state.loadingSymbols };

    results.forEach((value, index) => {
      const symbol = symbolsToFetch[index];

      nextLoading[symbol] = false;

      if (value.status === 'fulfilled') {
        nextCurrencies[symbol] = value.value.currency;
        nextErrors[symbol] = undefined;
      } else {
        nextErrors[symbol] = value.reason;
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
  currencies: Currency[];
  isLoading: boolean;
  isEmpty: boolean;
  errors: unknown[];
};

export const useCurrencies = () => {
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
    const activeCurrencies = activeSymbols
      .map((symbol) => currencies[symbol])
      .filter((currency): currency is Currency => !!currency);

    const isLoading = activeSymbols.some(
      (symbol) => loadingSymbols[symbol] === true
    );

    const isEmpty = activeCurrencies.length === 0;

    const errors = activeSymbols
      .map((symbol) => errorsBySymbol[symbol])
      .filter(Boolean);

    return {
      currencies: activeCurrencies,
      isLoading,
      errors,
      isEmpty,
    };
  }, [activeSymbols, currencies, loadingSymbols, errorsBySymbol]);
};

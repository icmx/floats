import { useMemo } from 'react';
import { create } from 'zustand';
import { fetchCurrencyBySymbol } from '../api/client';
import type { Currency, SymbolString } from '../types/currency';

export const useCurrenciesStore = create<{
  currencies: Map<SymbolString, Currency>;
  activeSymbols: SymbolString[];
  loadingSymbols: Set<SymbolString>;
  errorsBySymbol: Map<SymbolString, unknown>;
}>()(() => {
  return {
    currencies: new Map(),
    activeSymbols: [],
    loadingSymbols: new Set(),
    errorsBySymbol: new Map(),
  };
});

export const loadCurrenciesToStore = async (
  symbols: SymbolString[]
): Promise<void> => {
  const { currencies, loadingSymbols } = useCurrenciesStore.getState();

  const symbolsToFetch = symbols.filter(
    (symbol) => !currencies.has(symbol) && !loadingSymbols.has(symbol)
  );

  useCurrenciesStore.setState({ activeSymbols: symbols });

  if (symbolsToFetch.length === 0) {
    return;
  }

  useCurrenciesStore.setState((state) => ({
    loadingSymbols: new Set([
      ...state.loadingSymbols,
      ...symbolsToFetch,
    ]),
  }));

  const results = await Promise.allSettled(
    symbolsToFetch.map(async (symbol) => {
      const currency = await fetchCurrencyBySymbol(symbol);

      return { symbol, currency };
    })
  );

  useCurrenciesStore.setState((state) => {
    const nextCurrencies = new Map(state.currencies);
    const nextErrors = new Map(state.errorsBySymbol);
    const nextLoading = new Set(state.loadingSymbols);

    results.forEach((result, index) => {
      const symbol = symbolsToFetch[index];
      nextLoading.delete(symbol);

      if (result.status === 'fulfilled') {
        nextCurrencies.set(symbol, result.value.currency);
        nextErrors.delete(symbol);
      } else {
        nextErrors.set(symbol, result.reason);
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
  errors: unknown[];
  isEmpty: boolean;
};

export const useCurrencies = (): UseCurrencies => {
  const currencies = useCurrenciesStore((state) => state.currencies);
  const activeSymbols = useCurrenciesStore(
    (state) => state.activeSymbols
  );

  const activeCurrencies = useMemo(() => {
    return activeSymbols
      .map((symbol) => currencies.get(symbol))
      .filter((currency): currency is Currency => !!currency);
  }, [currencies, activeSymbols]);

  const loadingSymbols = useCurrenciesStore(
    (state) => state.loadingSymbols
  );

  const isLoading = loadingSymbols.size > 0;

  const isEmpty = useMemo(() => {
    return activeCurrencies.length === 0;
  }, [activeCurrencies]);

  const errorsBySymbol = useCurrenciesStore(
    (state) => state.errorsBySymbol
  );

  const errors = Array.from(errorsBySymbol.values());

  return { currencies: activeCurrencies, isLoading, errors, isEmpty };
};
